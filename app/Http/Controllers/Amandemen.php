<?php

namespace App\Http\Controllers;

use App\Models\Amandemen;
use Illuminate\Http\Request;

class AmandemenController extends Controller
{
    public function index()
    {
        return Amandemen::with('pengadaan')->paginate(15);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // 'kode_amandemen' => 'required|string|unique:amandemen,kode_amandemen,' . $amandemen->id,
            'no_kontrak' => 'reqiored|string',// Nomor kotrak dari tabel kontrak
            'tgl_kontrak' => 'required|date',
            'judul_kontrak' => 'required|string|max:255',
            'nilai_kotrak' => 'nullable|biginteger',// Nilai kontrak dari tabel kontrak
            'amandemen_ke' => 'nullable|string',
            'vendor' => 'required|string',// Vendor dari tabel kontrak
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

        return Amandemen::create($validated);
    }

    public function show(Amandemen $amandemen)
    {
        return $amandemen->load('pengadaan');
    }

    public function update(Request $request, Amandemen $amandemen)
    {
        $validated = $request->validate([
            // 'kode_amandemen' => 'required|string|unique:amandemen,kode_amandemen,' . $amandemen->id,
            'no_kontrak' => 'reqiored|string',// Nomor kotrak dari tabel kontrak
            'tgl_kontrak' => 'required|date',
            'judul_kontrak' => 'required|string|max:255',
            'nilai_kotrak' => 'nullable|biginteger',// Nilai kontrak dari tabel kontrak
            'amandemen_ke' => 'nullable|string',
            'vendor' => 'required|string',// Vendor dari tabel kontrak
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
        return $amandemen;
    }

    public function destroy(Amandemen $amandemen)
    {
        $amandemen->delete();
        return response()->json(['message' => 'Amandemen deleted successfully']);
    }
}