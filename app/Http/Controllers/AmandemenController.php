<?php

namespace App\Http\Controllers;

use App\Models\Amandemen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

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
                'no_kontrak' => 'required|string',  // Fixed typo
                'tgl_kontrak' => 'required|date',
                'judul_kontrak' => 'required|string|max:255',
                'nilai_kontrak' => 'nullable|integer',  // Fixed field name and type
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

    public function update(Request $request, Amandemen $amandemen): JsonResponse
    {
        try {
            $validated = $request->validate([
                'no_kontrak' => 'required|string',  // Fixed typo
                'tgl_kontrak' => 'required|date',
                'judul_kontrak' => 'required|string|max:255',
                'nilai_kontrak' => 'nullable|integer',  // Fixed field name and type
                'amandemen_ke' => 'nullable|string',
                'vendor' => 'required|string',
                'lingkup' => 'nullable|string',
                'tgl_nodin_amandemen' => 'nullable|date',
                'tgl_spa' => 'nullable|date',
                'tgl_tanggapan' => 'nullable|date',
                'rab_amandemen' => 'nullable|integer',  // Fixed type
                'no_amandemen' => 'required|string',
                'tgl_amandemen' => 'required|date',
                'nilai_amandemen' => 'nullable|integer',  // Fixed type
                'progress' => 'nullable|string',
                'status' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'pic' => 'nullable|string'
            ]);

            $amandemen->update($validated);
            return response()->json($amandemen);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update data', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Amandemen $amandemen): JsonResponse
    {
        try {
            $amandemen->delete();
            return response()->json(['message' => 'Data deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete data', 'message' => $e->getMessage()], 500);
        }
    }
}