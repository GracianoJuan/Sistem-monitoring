<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PengadaanController extends Controller
{
    /**
     * Validation rules untuk Pengadaan
     */
    private function validationRules(): array
    {
        return [
            'no_bantex' => 'nullable|integer|min:0',
            'nama_pekerjaan' => 'required|string|max:255',
            'tgl_nodin' => 'required|date',
            'tgl_dokumen_lengkap' => 'nullable|date',
            'pengguna' => 'required|string',
            'jenis' => 'required|string',
            'metode' => 'required|string',
            'rab' => 'nullable|integer|min:0',
            'hpe' => 'nullable|integer|min:0',
            'saving_hpe' => 'nullable|integer',
            'tgl_kebutuhan' => 'nullable|date',
            'progress' => 'nullable|string',
            'vendor' => 'nullable|string|max:255',
            'tgl_kontrak' => 'nullable|date',
            'no_perjanjian' => 'nullable|string|max:255',
            'nilai_kontrak' => 'nullable|integer|min:0',
            'mulai_kontrak' => 'nullable|date',
            'akhir_kontrak' => 'nullable|date|after_or_equal:mulai_kontrak',
            'jangka_waktu' => 'nullable|string',
            'status' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'pic' => 'nullable|string',
            'saving' => 'nullable|integer',
            'selisih_hari' => 'nullable|integer',
            'form_idd' => 'nullable|boolean',
            'penilaian_idd' => 'nullable|boolean'
        ];
    }

    public function index(): JsonResponse
    {
        try {
            $pengadaan = Pengadaan::orderBy('no_bantex', 'asc')->get();
            return response()->json($pengadaan);
        } catch (\Exception $e) {
            Log::error('Failed to fetch pengadaan: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate($this->validationRules());
            $pengadaan = Pengadaan::create($validated);

            return response()->json($pengadaan, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create pengadaan: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create data', $e], 500);
        }
    }

    public function show(Pengadaan $pengadaan): JsonResponse
    {
        return response()->json($pengadaan);
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $pengadaan = Pengadaan::findOrFail($id);
            $validated = $request->validate($this->validationRules());

            $pengadaan->update($validated);

            return response()->json($pengadaan);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Data not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update pengadaan: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update data'], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $pengadaan = Pengadaan::findOrFail($id);

            DB::transaction(function () use ($pengadaan) {
                $pengadaan->delete();
            });

            Log::info("Pengadaan deleted successfully", ['id' => $id]);

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
            Log::error('Failed to delete pengadaan', [
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
            $pengadaan = Pengadaan::findOrFail($id);
            $constraints = [];

            return response()->json([
                'success' => true,
                'data' => [
                    'record' => $pengadaan,
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

    public function dataStats(): JsonResponse
    {
        try {
            // Hitung total progress yang selesai
            $totalProgress = Pengadaan::whereNotNull('progress')->get();

            // Hitung total saving dengan query yang lebih efisien
            $stats = Pengadaan::whereNotNull('rab')
                ->whereNotNull('nilai_kontrak')
                ->selectRaw('
                    SUM(rab) as total_rab, 
                    SUM(nilai_kontrak) as total_kontrak,
                    SUM(hpe) as total_hpe
                ')
                ->first();
            $statsHpe = Pengadaan::whereNotNull('rab')
                ->whereNotNull('hpe')
                ->selectRaw('
                    SUM(rab) as total_rab, 
                    SUM(hpe) as total_hpe
                ')
                ->first();

            $totalRab = $stats->total_rab ?? 0;
            $totalKontrak = $stats->total_kontrak ?? 0;
            $totalRabHpe = $statsHpe->total_rab ?? 0;
            $totalHpe = $statsHpe->total_hpe ?? 0;

            // Hitung persentase saving
            $totalSaving = $totalRab > 0
                ? round((($totalRab - $totalKontrak) / $totalRab) * 100, 2)
                : 0;
            
            $totalSavingHpe = $totalHpe > 0
                ? round((($totalRabHpe - $totalHpe) / $totalRabHpe) * 100, 2)
                : 0;

            return response()->json([
                'data' => [
                    'progress_pengadaan' => [
                        ['value'=> 'Review KAK','total'=> $totalProgress->where('progress', 'Review KAK')->count()],
                        ['value'=>'Penusunan HPE HPS RKS','total'=> $totalProgress->where('progress', 'Penusunan HPE HPS RKS')->count()],
                        ['value'=>'Undangan','total'=> $totalProgress->where('progress', 'Undangan')->count()],
                        ['value'=>'Pendaftaran','total'=> $totalProgress->where('progress', 'Pendaftaran')->count()],
                        ['value'=>'Aanwijzing','total'=> $totalProgress->where('progress', 'Aanwijzing')->count()],
                        ['value'=>'Pemasukan Dokumen','total'=> $totalProgress->where('progress', 'Pemasukan Dokumen')->count()],
                        ['value'=>'Pembukaan Dokumen','total'=> $totalProgress->where('progress', 'Pembukaan Dokumen')->count()],
                        ['value'=>'Evaluasi','total'=> $totalProgress->where('progress', 'Evaluasi')->count()],
                        ['value'=>'Klarifikasi & Negosiasi','total'=> $totalProgress->where('progress', 'Klarifikasi & Negosiasi')->count()],
                        ['value'=>'Penetapan Penyedia','total'=> $totalProgress->where('progress', 'Penetapan Penyedia')->count()],
                        ['value'=>'Pengumuman','total'=> $totalProgress->where('progress', 'Pengumuman')->count()],
                        ['value'=>'Draft Kontrak/ SPK','total'=> $totalProgress->where('progress', 'Draft Kontrak/ SPK')->count()],
                        ['value'=>'Finalisasi Kontrak/ SPK','total'=> $totalProgress->where('progress', 'Finalisasi Kontrak/ SPK')->count()],
                        ['value'=>'Selesai','total'=> $totalProgress->where('progress', 'Selesai')->count()],                        
                    ],

                    'total_pengadaan' => Pengadaan::count(),
                    'total_saving_percentage' => $totalSaving,
                    'total_saving_nominal' => $totalRab - $totalKontrak,
                    'total_saving_hpe_percentage' => $totalSavingHpe,
                    'total_saving_hpe_nominal' => $totalRabHpe - $totalHpe
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics'
            ], 500);
        }
    }
}
