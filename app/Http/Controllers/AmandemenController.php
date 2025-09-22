<?php

namespace App\Http\Controllers;

use App\Models\Amandemen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AmandemenController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $amandemen = Amandemen::orderBy('created_at', 'desc')->get();
            return response()->json($amandemen);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'no_kontrak' => 'reqiored|string', // Nomor kotrak dari tabel kontrak
                'tgl_kontrak' => 'required|date',
                'judul_kontrak' => 'required|string|max:255',
                'nilai_kotrak' => 'nullable|biginteger', // Nilai kontrak dari tabel kontrak
                'amandemen_ke' => 'nullable|string',
                'vendor' => 'required|string', // Vendor dari tabel kontrak
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
            return response()->json(['error' => 'Failed to create data'], 500);
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
                'no_kontrak' => 'reqiored|string', // Nomor kotrak dari tabel kontrak
                'tgl_kontrak' => 'required|date',
                'judul_kontrak' => 'required|string|max:255',
                'nilai_kotrak' => 'nullable|biginteger', // Nilai kontrak dari tabel kontrak
                'amandemen_ke' => 'nullable|string',
                'vendor' => 'required|string', // Vendor dari tabel kontrak
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

            $amandemen->update($validated);
            return response()->json($amandemen);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update data'], 500);
        }
    }

    public function destroy(Amandemen $amandemen): JsonResponse
    {
        try {
            $amandemen->delete();
            return response()->json(['message' => 'Data deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete data'], 500);
        }
    }
}
