<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BulkImportController extends Controller
{
    /**
     * Bulk import for Pengadaan
     */
    public function importPengadaan(Request $request)
    {
        // Log incoming request
        Log::info('Pengadaan import request received', [
            'data_count' => count($request->input('data', []))
        ]);

        $validator = Validator::make($request->all(), [
            'data' => 'required|array|min:1',
            'data.*.nama_pekerjaan' => 'required|string',
            'data.*.tgl_nodin' => 'required|date',
            'data.*.pengguna' => 'required|string',
            'data.*.jenis' => 'required|string',
            'data.*.metode' => 'required|string',
            'data.*.vendor' => 'required|string',
            'data.*.no_perjanjian' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $imported = 0;
            $failed = [];

            foreach ($request->data as $index => $row) {
                try {
                    // Prepare data for insertion
                    $data = $this->preparePengadaanData($row);
                    
                    Log::info("Inserting row " . ($index + 1), ['data' => $data]);
                    
                    // Insert into database
                    DB::table('pengadaan')->insert($data);
                    $imported++;
                } catch (\Exception $e) {
                    Log::error("Failed to import row " . ($index + 1), [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'data' => $row
                    ]);
                    $failed[] = [
                        'row' => $index + 1,
                        'error' => $e->getMessage()
                    ];
                }
            }

            DB::commit();

            Log::info('Import completed', [
                'imported' => $imported,
                'failed' => count($failed)
            ]);

            return response()->json([
                'message' => "Successfully imported {$imported} records",
                'imported' => $imported,
                'failed' => count($failed),
                'errors' => $failed
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk import error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk import for Amandemen
     */
    public function importAmandemen(Request $request)
    {
        // Log incoming request
        Log::info('Amandemen import request received', [
            'data_count' => count($request->input('data', []))
        ]);

        $validator = Validator::make($request->all(), [
            'data' => 'required|array|min:1',
            'data.*.judul_kontrak' => 'required|string',
            'data.*.amandemen_ke' => 'required',
            'data.*.vendor' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $imported = 0;
            $failed = [];

            foreach ($request->data as $index => $row) {
                try {
                    // Prepare data for insertion
                    $data = $this->prepareAmandemenData($row);
                    
                    Log::info("Inserting row " . ($index + 1), ['data' => $data]);
                    
                    // Insert into database
                    DB::table('amandemen')->insert($data);
                    $imported++;
                } catch (\Exception $e) {
                    Log::error("Failed to import row " . ($index + 1), [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'data' => $row
                    ]);
                    $failed[] = [
                        'row' => $index + 1,
                        'error' => $e->getMessage()
                    ];
                }
            }

            DB::commit();

            Log::info('Import completed', [
                'imported' => $imported,
                'failed' => count($failed)
            ]);

            return response()->json([
                'message' => "Successfully imported {$imported} records",
                'imported' => $imported,
                'failed' => count($failed),
                'errors' => $failed
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk import error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Prepare Pengadaan data for insertion
     */
    private function preparePengadaanData($row)
    {
        return [
            'no_bantex' => $row['no_bantex'] ?? null,
            'nama_pekerjaan' => $row['nama_pekerjaan'],
            'tgl_nodin' => $row['tgl_nodin'],
            'tgl_dokumen_lengkap' => $row['tgl_dokumen_lengkap'] ?? null,
            'pengguna' => $row['pengguna'],
            'jenis' => $row['jenis'],
            'metode' => $row['metode'],
            'rab' => $row['rab'] ?? null,
            'keterangan_rab' => $row['keterangan_rab'] ?? null,
            'hpe' => $row['hpe'] ?? null,
            'keterangan_hpe' => $row['keterangan_hpe'] ?? null,
            'saving_hpe' => $row['saving_hpe'] ?? null,
            'tgl_kebutuhan' => $row['tgl_kebutuhan'] ?? null,
            'progress' => $row['progress'] ?? null,
            'vendor' => $row['vendor'],
            'tgl_kontrak' => $row['tgl_kontrak'] ?? null,
            'no_perjanjian' => $row['no_perjanjian'],
            'nilai_kontrak' => $row['nilai_kontrak'] ?? null,
            'keterangan_nilai_kontrak' => $row['keterangan_nilai_kontrak'] ?? null,
            'mulai_kontrak' => $row['mulai_kontrak'] ?? null,
            'akhir_kontrak' => $row['akhir_kontrak'] ?? null,
            'jangka_waktu' => $row['jangka_waktu'] ?? null,
            'status' => $row['status'] ?? null,
            'keterangan' => $row['keterangan'] ?? null,
            'pic' => $row['pic'] ?? null,
            'saving' => $row['saving'] ?? null,
            'selisih_hari' => $row['selisih_hari'] ?? null,
            'form_idd' => isset($row['form_idd']) ? (bool) $row['form_idd'] : false,
            'penilaian_idd' => isset($row['penilaian_idd']) ? (bool) $row['penilaian_idd'] : false,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Prepare Amandemen data for insertion
     */
    private function prepareAmandemenData($row)
    {
        return [
            'no_bantex' => $row['no_bantex'] ?? null,
            'no_kontrak' => $row['no_kontrak'] ?? null,
            'tgl_kontrak' => $row['tgl_kontrak'] ?? null,
            'judul_kontrak' => $row['judul_kontrak'],
            'nilai_kontrak' => $row['nilai_kontrak'] ?? null,
            'amandemen_ke' => $row['amandemen_ke'],
            'vendor' => $row['vendor'],
            'lingkup' => $row['lingkup'] ?? null,
            'tgl_nodin_amandemen' => $row['tgl_nodin_amandemen'] ?? null,
            'tgl_spa' => $row['tgl_spa'] ?? null,
            'tgl_tanggapan' => $row['tgl_tanggapan'] ?? null,
            'rab_amandemen' => $row['rab_amandemen'] ?? null,
            'keterangan_rab_amandemen' => $row['keterangan_rab_amandemen'] ?? null,
            'no_amandemen' => $row['no_amandemen'] ?? null,
            'tgl_amandemen' => $row['tgl_amandemen'] ?? null,
            'nilai_amandemen' => $row['nilai_amandemen'] ?? null,
            'keterangan_nilai_amandemen' => $row['keterangan_nilai_amandemen'] ?? null,
            'progress' => $row['progress'] ?? null,
            'status' => $row['status'] ?? null,
            'keterangan' => $row['keterangan'] ?? null,
            'pic' => $row['pic'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}