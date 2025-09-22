<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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

    public function update(Request $request, Pengadaan $pengadaan): JsonResponse
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

            $pengadaan->update($validated);
            return response()->json($pengadaan);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update data'], 500);
        }
    }

    public function destroy(Pengadaan $pengadaan): JsonResponse
    {
        try {
            $pengadaan->delete();
            return response()->json(['message' => 'Data deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete data'], 500);
        }
    }
}
