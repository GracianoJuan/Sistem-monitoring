<?php

namespace App\Http\Controllers;

use App\Models\Kontrak;
use App\Models\Pengadaan;
use Illuminate\Http\Request;

class PengadaanController extends Controller
{
    public function index()
    {
        return Pengadaan::paginate(15);
    }

    public function store(Request $request)
    {
        try {
            $validatedPengadaan = $request->validate([
                'nama_pengadaan' => 'required|string|max:255',
                'tgl_nodin' => 'required|date',
                'tgl_dokumen_lengkap' => 'nullable|string',
                'pengguna' => 'required|string',
                'jenis' => 'required|numeric',
                'metode' => 'required|string',
                'rab' => 'nullable|numeric',
                'tgl_kebutuhan' => 'nullable|date',
                'progress' => 'required|string',
                // Vendor dari tabel kontrak
                'tgl_kontrak' => 'nullable|date',
                // Nomor perjanjian dari tabel kontrak (no_kontrak)
                // nilai kontrak dari tabel kontrak (nilai_kontrak)
                'mulai_kontrak' => 'nullable|date',
                'akhir_kontrak' => 'required|date',
                'jangka_waktu' => 'nullable|string',
                'status' => 'nullable|string',
                'keterangan' => 'nullable|string',
                'pic' => 'nullable|string',
                'saving' => 'nullable|numeric',
                'selisih_hari' => 'nullable|numeric',
                'form_idd' => 'nullable|boolean',
                'penilaian_id' => 'nullable|boolean',
            ]);

            $validatedKontrak = $request->validate([
                'no_kontrak' => 'nullable|string|max:255',
                'nilai_kontrak' => 'nullable|numeric',
                'vendor' => 'nullable|string|max:255',
            ]);

            $addPengadaan = Pengadaan::create($validatedPengadaan);
            $addKontrak = Kontrak::create($validatedKontrak);
            return ($addPengadaan & $addKontrak);
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function show(Pengadaan $pengadaan)
    {
        return $pengadaan;
    }

    public function update(Request $request, Pengadaan $pengadaan, Kontrak $kontrak)
    {
        $validatedPengadaan = $request->validate([
            'nama_pengadaan' => 'required|string|max:255',
            'tgl_nodin' => 'required|date',
            'tgl_dokumen_lengkap' => 'nullable|string',
            'pengguna' => 'required|string',
            'jenis' => 'required|numeric',
            'metode' => 'required|string',
            'rab' => 'nullable|numeric',
            'tgl_kebutuhan' => 'nullable|numeric',
            'progress' => 'required|string',
            // Vendor dari tabel kontrak
            'tgl_kontrak' => 'nullable|date',
            // Nomor perjanjian dari tabel kontrak (no_kontrak)
            // nilai kontrak dari tabel kontrak (nilai_kontrak)
            'mulai_kontrak' => 'nullable|date',
            'akhir_kontrak' => 'required|date',
            'jangka_waktu' => 'nullable|string',
            'status' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'pic' => 'nullable|string',
            'saving' => 'nullable|numeric',
            'selisih_hari' => 'nullable|numeric',
            'form_idd' => 'nullable|boolean',
            'penilaian_id' => 'nullable|boolean',
        ]);

        $validatedKontrak = $request->validate([
            'no_kontrak' => 'nullable|string|max:255',
            'nilai_kontrak' => 'nullable|numeric',
            'vendor' => 'nullable|string|max:255',
        ]);
        $pengadaan->update($validatedPengadaan);
        $kontrak->update($validatedKontrak);
        return $pengadaan;
    }

    public function destroy(Pengadaan $pengadaan)
    {
        $pengadaan->delete();
        return response()->json(['message' => 'Pengadaan deleted successfully']);
    }
}
