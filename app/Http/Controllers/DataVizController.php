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
            //  Data Summary
            $summary = [
                'total_pekerjaan'   => DB::table('pengadaan')->count(),
                'total_rab'         => DB::table('pengadaan')->sum('rab'),
                'total_kontrak'     => DB::table('pengadaan')->sum('nilai_kontrak'),

                'total_nilai_amandemen' => DB::table('pengadaan')
                    ->leftJoin('amandemen', 'pengadaan.no_perjanjian', '=', 'amandemen.no_kontrak')
                    ->selectRaw('COALESCE(SUM(pengadaan.nilai_kontrak + amandemen.nilai_amandemen), SUM(pengadaan.nilai_kontrak)) as total')
                    ->value('total'),

                'avg_saving'        => DB::table('pengadaan')->avg('saving'),
                'total_done'        => DB::table('pengadaan')->where('status', 'Done')->count(),
                'total_selesai'     => DB::table('pengadaan')->where('progress', 'Selesai')->count(),
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

            //  Chart: Pengadaan per User/Pengguna
            $pengadaan_per_user = DB::table('pengadaan')
                ->select('pengguna as label', DB::raw('COUNT(*) as count'))
                ->groupBy('pengguna')
                ->get();

            //  Chart: Kontrak per User/Pengguna
            $kontrak_per_user = DB::table('pengadaan')
                ->select('pengguna as label', DB::raw('SUM(nilai_kontrak) as total'))
                ->groupBy('pengguna')
                ->get();



            $charts = [
                'metode'   => $metode_pengadaan,
                'progress'            => $progress,
                'jenis'               => $jenis,
                'kontrak_per_user'    => $kontrak_per_user,
                'pengadaan_per_user'    => $pengadaan_per_user,
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
