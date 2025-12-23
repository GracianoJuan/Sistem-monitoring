<?php

namespace App\Http\Controllers;

use App\Models\Amandemen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AmandemenController extends Controller
{
    private function validationRules(): array
    {
        return [
            'no_bantex' => 'nullable|integer|min:0',
            'no_kontrak' => 'required|string',
            'tgl_kontrak' => 'nullable|date',
            'judul_kontrak' => 'required|string|max:255',
            'nilai_kontrak' => 'nullable|integer|min:0',
            'amandemen_ke' => 'nullable|string',
            'vendor' => 'required|string',
            'lingkup' => 'nullable|string',
            'tgl_nodin_amandemen' => 'nullable|date',
            'tgl_spa' => 'nullable|date',
            'tgl_tanggapan' => 'nullable|date',
            'rab_amandemen' => 'nullable|integer|min:0',
            'keterangan_rab_amandemen' => 'nullable|string',
            'no_amandemen' => 'nullable|string',
            'tgl_amandemen' => 'nullable|date',
            'nilai_amandemen' => 'nullable|integer|min:0',
            'keterangan_nilai_amandemen' => 'nullable|string',
            'progress' => 'nullable|string',
            'status' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'pic' => 'nullable|string'
        ];
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $query = Amandemen::query();
            
            // Filter by year if provided
            if ($request->has('year') && $request->year) {
                $query->whereYear('created_at', $request->year);
            }
            
            $amandemen = $query->orderBy('no_bantex', 'asc')->get();
            return response()->json($amandemen);
        } catch (\Exception $e) {
            Log::error('Failed to fetch amandemen: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }

    public function getAvailableYears(): JsonResponse
    {
        try {
            $years = Amandemen::selectRaw('DISTINCT YEAR(created_at) as year')
                ->whereNotNull('created_at')
                ->orderBy('year', 'desc')
                ->pluck('year');
            
            return response()->json($years);
        } catch (\Exception $e) {
            Log::error('Failed to fetch available years: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch years'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate($this->validationRules());
            $amandemen = Amandemen::create($validated);

            return response()->json($amandemen, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create amandemen: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create data'], 500);
        }
    }

    public function show(Amandemen $amandemen): JsonResponse
    {
        return response()->json($amandemen);
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $amandemen = Amandemen::findOrFail($id);
            $validated = $request->validate($this->validationRules());

            $amandemen->update($validated);

            return response()->json($amandemen);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Data not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update amandemen: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update data'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $amandemen = Amandemen::findOrFail($id);

            DB::transaction(function () use ($amandemen) {
                $amandemen->delete();
            });

            Log::info("Amandemen deleted successfully", ['id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Data deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete amandemen', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete data'
            ], 500);
        }
    }

    public function checkConstraints($id): JsonResponse
    {
        try {
            $amandemen = Amandemen::findOrFail($id);
            $constraints = [];

            return response()->json([
                'success' => true,
                'data' => [
                    'record' => $amandemen,
                    'constraints' => $constraints,
                    'can_delete' => empty($constraints)
                ]
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Record not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to check constraints: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to check constraints'
            ], 500);
        }
    }
}