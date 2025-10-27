<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataVizController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            //  Summary
            $summary = [
                'total_pekerjaan'   => DB::table('pengadaan')->count(),
                'total_rab'         => DB::table('pengadaan')->sum('rab'),
                'total_kontrak'     => DB::table('pengadaan')->sum('nilai_kontrak'),
                'avg_saving'        => DB::table('pengadaan')->avg('saving'),
                'avg_selisih_hari'  => DB::table('pengadaan')->avg('selisih_hari'),
                'total_done'        => DB::table('pengadaan')->where('status', 'Done')->count(),
                'total_selesai'     => DB::table('pengadaan')->where('progress', 'Selesai')->count(),
                'unique_pengguna'   => DB::table('pengadaan')->distinct('pengguna')->count('pengguna'),
            ];

            // Chart: Metode Pengadaan
            $metode_pengadaan = DB::table('pengadaan')
                ->select('metode as label', DB::raw('COUNT(*) as count'))
                ->groupBy('metode')
                ->get();

            //  Chart: Progress
            $progress = DB::table('pengadaan')
                ->select('progress as label', DB::raw('COUNT(*) as count'))
                ->groupBy('progress')
                ->get();

            //  Chart: Jenis (total nilai kontrak per jenis)
            $jenis = DB::table('pengadaan')
                ->select('jenis as label', DB::raw('SUM(nilai_kontrak) as total'))
                ->groupBy('jenis')
                ->get();

            //  Chart: Average Saving per Metode Pengadaan
            $saving_per_metode = DB::table('pengadaan')
                ->select('metode as label', DB::raw('AVG(saving) as avg_saving'))
                ->groupBy('metode')
                ->get();

            //  Chart: Rata-rata Selisih Hari per Progress
            $selisih_per_progress = DB::table('pengadaan')
                ->select('progress as label', DB::raw('AVG(selisih_hari) as avg_selisih'))
                ->groupBy('progress')
                ->get();

            //  Gabungkan hasil
            $charts = [
                'metode'   => $metode_pengadaan,
                'progress'            => $progress,
                'jenis'               => $jenis,
                'saving_per_metode'   => $saving_per_metode,
                'selisih_per_progress' => $selisih_per_progress,
            ];

            return response()->json([
                'summary' => $summary,
                'charts'  => $charts,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e
            ]);
        }
    }

    // Pengadaan per user
    public function userPengadaan($user): JsonResponse
    {
        try {
            # code...
            $data = 'zzz';
            return response()->json($data);
        } catch (\Throwable $e) {
            # code...
            return response()->json(['error' => 'Invalid'], 500);
        }
    }
    public function progressPengadaan(): JsonResponse
    {
        try {
            // Hitung total progress yang selesai
            $totalProgress = Pengadaan::whereNotNull('progress')->get();

            return response()->json([
                'data' => [
                    'progress_pengadaan' => [
                        ['value' => 'Review KAK', 'total' => $totalProgress->where('progress', 'Review KAK')->count()],
                        ['value' => 'Penusunan HPE HPS RKS', 'total' => $totalProgress->where('progress', 'Penusunan HPE HPS RKS')->count()],
                        ['value' => 'Undangan', 'total' => $totalProgress->where('progress', 'Undangan')->count()],
                        ['value' => 'Pendaftaran', 'total' => $totalProgress->where('progress', 'Pendaftaran')->count()],
                        ['value' => 'Aanwijzing', 'total' => $totalProgress->where('progress', 'Aanwijzing')->count()],
                        ['value' => 'Pemasukan Dokumen', 'total' => $totalProgress->where('progress', 'Pemasukan Dokumen')->count()],
                        ['value' => 'Pembukaan Dokumen', 'total' => $totalProgress->where('progress', 'Pembukaan Dokumen')->count()],
                        ['value' => 'Evaluasi', 'total' => $totalProgress->where('progress', 'Evaluasi')->count()],
                        ['value' => 'Klarifikasi & Negosiasi', 'total' => $totalProgress->where('progress', 'Klarifikasi & Negosiasi')->count()],
                        ['value' => 'Penetapan Penyedia', 'total' => $totalProgress->where('progress', 'Penetapan Penyedia')->count()],
                        ['value' => 'Pengumuman', 'total' => $totalProgress->where('progress', 'Pengumuman')->count()],
                        ['value' => 'Draft Kontrak/ SPK', 'total' => $totalProgress->where('progress', 'Draft Kontrak/ SPK')->count()],
                        ['value' => 'Finalisasi Kontrak/ SPK', 'total' => $totalProgress->where('progress', 'Finalisasi Kontrak/ SPK')->count()],
                        ['value' => 'Selesai', 'total' => $totalProgress->where('progress', 'Selesai')->count()],
                    ],

                    'total_pengadaan' => Pengadaan::count(),

                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics'
            ], 500);
        }
    }

    public function getTotalSaving(): JsonResponse
    {
        try {
            // Query to get relevant data for count total saving rab vs nilai kontrak
            $stats = Pengadaan::whereNotNull('rab')
                ->whereNotNull('nilai_kontrak')
                ->selectRaw('
                    SUM(rab) as total_rab, 
                    SUM(nilai_kontrak) as total_kontrak,
                    SUM(hpe) as total_hpe
                ')
                ->first();

            // Query to get relevant data for count total saving rab vs hpe
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
                    'total_saving_percentage' => $totalSaving,
                    'total_saving_nominal' => $totalRab - $totalKontrak,
                    'total_saving_hpe_percentage' => $totalSavingHpe,
                    'total_saving_hpe_nominal' => $totalRabHpe - $totalHpe
                ]
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Invalid'], 500);
        }
    }

    public function getSummary(): JsonResponse
    {
        try {
            //  Summary
            $summary = [
                'total_pekerjaan'   => DB::table('pengadaan')->count(),
                'total_rab'         => DB::table('pengadaan')->sum('rab'),
                'total_kontrak'     => DB::table('pengadaan')->sum('nilai_kontrak'),
                'avg_saving'        => DB::table('pengadaan')->avg('saving'),
                'avg_selisih_hari'  => DB::table('pengadaan')->avg('selisih_hari'),
                'total_done'        => DB::table('pengadaan')->where('status', 'Done')->count(),
                'total_selesai'     => DB::table('pengadaan')->where('progress', 'Selesai')->count(),
                'unique_pengguna'   => DB::table('pengadaan')->distinct('pengguna')->count('pengguna'),
            ];

            // Chart: Metode Pengadaan
            $metode_pengadaan = DB::table('pengadaan')
                ->select('metode as label', DB::raw('COUNT(*) as count'))
                ->groupBy('metode')
                ->get();

            //  Chart: Progress
            $progress = DB::table('pengadaan')
                ->select('progress as label', DB::raw('COUNT(*) as count'))
                ->groupBy('progress')
                ->get();

            //  Chart: Jenis (total nilai kontrak per jenis)
            $jenis = DB::table('pengadaan')
                ->select('jenis as label', DB::raw('SUM(nilai_kontrak) as total'))
                ->groupBy('jenis')
                ->get();

            //  Chart: Average Saving per Metode Pengadaan
            $saving_per_metode = DB::table('pengadaan')
                ->select('metode as label', DB::raw('AVG(saving) as avg_saving'))
                ->groupBy('metode')
                ->get();

            //  Chart: Rata-rata Selisih Hari per Progress
            $selisih_per_progress = DB::table('pengadaan')
                ->select('progress as label', DB::raw('AVG(selisih_hari) as avg_selisih'))
                ->groupBy('progress')
                ->get();

            //  Gabungkan hasil
            $charts = [
                'metode'   => $metode_pengadaan,
                'progress'            => $progress,
                'jenis'               => $jenis,
                'saving_per_metode'   => $saving_per_metode,
                'selisih_per_progress' => $selisih_per_progress,
            ];

            return response()->json([
                'summary' => $summary,
                'charts'  => $charts,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e
            ]);
        }
    }
}
