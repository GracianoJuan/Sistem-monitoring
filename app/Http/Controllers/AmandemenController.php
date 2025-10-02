<?php

namespace App\Http\Controllers;

use App\Models\Amandemen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AmandemenController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $amandemen = Amandemen::orderBy('id', 'desc')->get();
            return response()->json($amandemen);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch data', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                // 'no_bantex' => 'nullable|integer',
                'no_kontrak' => 'required|string',
                'tgl_kontrak' => 'required|date',
                'judul_kontrak' => 'required|string|max:255',
                'nilai_kontrak' => 'nullable|integer',
                'amandemen_ke' => 'required|string',
                'vendor' => 'required|string',
                'lingkup' => 'nullable|string',
                'tgl_nodin_amandemen' => 'nullable|date',
                'tgl_spa' => 'nullable|date',
                'tgl_tanggapan' => 'nullable|date',
                'rab_amandemen' => 'nullable|integer',
                'no_amandemen' => 'required|string',
                'tgl_amandemen' => 'required|date',
                'nilai_amandemen' => 'nullable|integer',
                'progress' => 'nullable|string',
                'status' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'pic' => 'nullable|string'
            ]);

            $amandemen = Amandemen::create($validated);
            return response()->json($amandemen, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create data', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(Amandemen $amandemen): JsonResponse
    {
        return response()->json($amandemen);
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                // 'no_bantex' => 'nullable|integer',
                'no_kontrak' => 'required|string',
                'tgl_kontrak' => 'required|date',
                'judul_kontrak' => 'required|string|max:255',
                'nilai_kontrak' => 'nullable|integer',
                'amandemen_ke' => 'nullable|string',
                'vendor' => 'required|string',
                'lingkup' => 'nullable|string',
                'tgl_nodin_amandemen' => 'nullable|date',
                'tgl_spa' => 'nullable|date',
                'tgl_tanggapan' => 'nullable|date',
                'rab_amandemen' => 'nullable|integer',
                'no_amandemen' => 'required|string',
                'tgl_amandemen' => 'required|date',
                'nilai_amandemen' => 'nullable|integer',
                'progress' => 'nullable|string',
                'status' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'pic' => 'nullable|string'
            ]);

            $amandemen = Amandemen::find($id);
            $amandemen->update($validated);
            return response()->json($amandemen);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update data', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            if (empty($id)) {
                Log::error('Empty or invalid ID provided');
                return response()->json(['error' => 'Invalid ID provided'], 400);
            }
            
            $amandemen = Amandemen::find($id);
            
            if (!$amandemen) {
                Log::warning('Amandemen not found with ID: ' . $id);
                return response()->json(['error' => 'Data not found'], 404);
            }    
            DB::enableQueryLog();
            try {
                $result = DB::transaction(function () use ($amandemen, $id) {
                    Log::info('Starting database transaction for delete');
                    
                    $existsBefore = Amandemen::where('id', $id)->exists();
                    Log::info('Record exists before deletion: ' . ($existsBefore ? 'true' : 'false'));
                    
                    if (!$existsBefore) {
                        throw new \Exception('Record does not exist before deletion');
                    }
                    
                    $deleted = $amandemen->delete();
                    Log::info('Delete method returned: ' . ($deleted ? 'true' : 'false'));
                    
                    if (!$deleted) {
                        throw new \Exception('Delete method returned false');
                    }
                    
                    $existsAfter = Amandemen::where('id', $id)->exists();
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
                
                // Get executed queries for debugging
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
    
    // Add a method to check for foreign key constraints
    public function checkConstraints($id): JsonResponse
    {
        try {
            $amandemen = Amandemen::find($id);
            if (!$amandemen) {
                return response()->json(['error' => 'Record not found'], 404);
            }
            
            // Check for any related records that might prevent deletion
            // Add checks for your specific relationships here
            // Example:
            // $relatedRecords = SomeModel::where('amandemen_id', $id)->count();
            
            $constraints = [];
            // Add your constraint checks here
            
            return response()->json([
                'record' => $amandemen,
                'constraints' => $constraints,
                'can_delete' => empty($constraints)
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}