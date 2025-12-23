<?php

namespace Database\Seeders;

use App\Models\Pengadaan;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'juangraciano2349@gmail.com',
            'password' => Hash::make('juangraciano2349'),
            'role' => 'admin',
            'email_verified_at' => now()
        ]);
        // Pengadaan::factory()->create([
        //     'no_bantex' => '1',
        //     'nama_pekerjaan' => 'Pekerjaan',
        //     'tgl_nodin' => now(),
        //     'tgl_dokumen_lengkap' => now(),
        //     'pengguna' => 'RKM',
        //     'jenis' => 'Jasa Konsultan',
        //     'metode' => 'Tender Sederhana',
        //     'rab' => 80000000,
        //     'hpe' => 75000000,
        //     'saving_hpe' => 12,
        //     'tgl_kebutuhan' => now(),
        //     'progress' => 'Selesai',
        //     'vendor' => 'Vendor',
        //     'tgl_kontrak' => now(),
        //     'no_perjanjian' => 'perjanjian-001',
        //     'nilai_kontrak' => 75000000,
        //     'mulai_kontrak' => now(),
        //     'akhir_kontrak' => Date('2024-12-31'),
        //     'jangka_waktu' => '',
        //     'status' => '',
        //     'keterangan' => 'no',
        //     'pic' => 'siapa',
        //     'saving' => 12,
        //     'selisih_hari' => 8,
        //     'form_idd' => true,
        //     'penilaian_idd' => true,
        //     'created_at' => Date('2023-01-15 10:00:00'),
        //     'updated_at' => now(),
        // ]);
    }
}
