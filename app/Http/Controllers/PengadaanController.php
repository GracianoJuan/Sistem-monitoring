<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PengadaanController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $pengadaan = Pengadaan::orderBy('id', 'desc')->get();
            return response()->json($pengadaan);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_pengadaan' => 'required|string|max:255',
                'tgl_nodin' => 'required|date',
                'tgl_dokumen_lengkap' => 'nullable|string',
                'pengguna' => 'required|string',
                'jenis' => 'required|numeric',
                'metode' => 'required|string',
                'rab' => 'nullable|numeric',
                'tgl_kebutuhan' => 'nullable|numeric',
                'progress' => 'required|string',
                'vendor' => 'nullable|string|max:255',
                'tgl_kontrak' => 'nullable|date',
                'no_kontrak' => 'nullable|string|max:255',
                'nilai_kontrak' => 'nullable|numeric',
                'mulai_kontrak' => 'nullable|date',
                'akhir_kontrak' => 'required|date',
                'jangka_waktu' => 'nullable|string',
                'status' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'pic' => 'nullable|string',
                'saving' => 'nullable|numeric',
                'selisih_hari' => 'nullable|string',
                'form_idd' => 'nullable|boolean',
                'penilaian_id' => 'nullable|boolean'
            ]);

            $pengadaan = Pengadaan::create($validated);
            return response()->json($pengadaan, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create data'], 500);
        }
    }

    public function show(Pengadaan $pengadaan): JsonResponse
    {
        return response()->json($pengadaan);
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nama_pengadaan' => 'required|string|max:255',
                'tgl_nodin' => 'required|date',
                'tgl_dokumen_lengkap' => 'nullable|string',
                'pengguna' => 'required|string',
                'jenis' => 'required|numeric',
                'metode' => 'required|string',
                'rab' => 'nullable|numeric',
                'tgl_kebutuhan' => 'nullable|numeric',
                'progress' => 'required|string',
                'vendor' => 'nullable|string|max:255',
                'tgl_kontrak' => 'nullable|date',
                'no_kontrak' => 'nullable|string|max:255',
                'nilai_kontrak' => 'nullable|numeric',
                'mulai_kontrak' => 'nullable|date',
                'akhir_kontrak' => 'required|date',
                'jangka_waktu' => 'nullable|string',
                'status' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'pic' => 'nullable|string',
                'saving' => 'nullable|numeric',
                'selisih_hari' => 'nullable|numeric',
                'form_idd' => 'nullable|boolean',
                'penilaian_id' => 'nullable|boolean'
            ]);

            $pengadaan = Pengadaan::find($id);
            $pengadaan->update($validated);
            return response()->json($pengadaan);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update data'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            if (empty($id)) {
                Log::error('Empty or invalid ID provided');
                return response()->json(['error' => 'Invalid ID provided'], 400);
            }
            
            $pengadaan = Pengadaan::find($id);
            
            if (!$pengadaan) {
                Log::warning('Pengadaan not found with ID: ' . $id);
                return response()->json(['error' => 'Data not found'], 404);
            }    
            DB::enableQueryLog();
            try {
                $result = DB::transaction(function () use ($pengadaan, $id) {
                    Log::info('Starting database transaction for delete');
                    
                    $existsBefore = Pengadaan::where('id', $id)->exists();
                    Log::info('Record exists before deletion: ' . ($existsBefore ? 'true' : 'false'));
                    
                    if (!$existsBefore) {
                        throw new \Exception('Record does not exist before deletion');
                    }
                    
                    $deleted = $pengadaan->delete();
                    Log::info('Delete method returned: ' . ($deleted ? 'true' : 'false'));
                    
                    if (!$deleted) {
                        throw new \Exception('Delete method returned false');
                    }
                    
                    $existsAfter = Pengadaan::where('id', $id)->exists();
                    Log::info('Record exists after deletion: ' . ($existsAfter ? 'true' : 'false'));
                    
                    if ($existsAfter) {
                        throw new \Exception('Record still exists after deletion');
                    }
                    
                    return true;
                });
                
                $queries = DB::getQueryLog();
                Log::info('Executed queries during delete:', $queries);
                
                if ($result) {
                    Log::info('=== DELETE OPERATION SUCCESSFUL ===');
                    return response()->json(['message' => 'Data deleted successfully']);
                } else {
                    Log::error('Transaction completed but result was false');
                    return response()->json(['error' => 'Delete operation failed - unknown reason'], 500);
                }
                
            } catch (\Exception $transactionError) {
                Log::error('Transaction error during delete:', [
                    'id' => $id,
                    'error' => $transactionError->getMessage(),
                    'trace' => $transactionError->getTraceAsString()
                ]);
                
                $queries = DB::getQueryLog();
                Log::info('Executed queries during failed delete:', $queries);
                
                return response()->json([
                    'error' => 'Delete operation failed', 
                    'details' => $transactionError->getMessage()
                ], 500);
            }
            
        } catch (\Exception $e) {
            Log::error('=== DELETE OPERATION FAILED ===');
            Log::error('Exception during delete operation:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Get executed queries for debugging
            if (DB::logging()) {
                $queries = DB::getQueryLog();
                Log::info('Executed queries during exception:', $queries);
            }
            
            return response()->json([
                'error' => 'Failed to delete data', 
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    public function checkConstraints($id): JsonResponse
    {
        try {
            $pengadaan = Pengadaan::find($id);
            if (!$pengadaan) {
                return response()->json(['error' => 'Record not found'], 404);
            }
            $constraints = [];
            return response()->json([
                'record' => $pengadaan,
                'constraints' => $constraints,
                'can_delete' => empty($constraints)
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
