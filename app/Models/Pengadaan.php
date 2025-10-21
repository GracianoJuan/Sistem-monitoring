<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengadaan extends Model
{
    use HasFactory;

    protected $table = 'pengadaan';
    
    protected $fillable = [
        'no_bantex',
        'nama_pekerjaan',
        'tgl_nodin',
        'tgl_dokumen_lengkap',
        'jenis',
        'metode',
        'rab',
        'hpe',
        'saving_hpe',
        'tgl_kebutuhan',
        'progress',
        'vendor',
        'pengguna',
        'tgl_kontrak',
        'no_perjanjian',
        'nilai_kontrak',
        'mulai_kontrak',
        'akhir_kontrak',
        'jangka_waktu',
        'status',
        'keterangan',
        'pic',
        'saving',
        'selisih_hari',
        'form_idd',
        'penilaian_idd'
        // 'penilaian_kinerja'
    ];

    protected $casts = [
        'no_bantex' => 'integer',
        'tgl_nodin' => 'date',
        'tgl_dokumen_lengkap' => 'date',
        'tgl_kontrak' => 'date',
        'mulai_kontrak' => 'date',
        'akhir_kontrak' => 'date',
        'rab' => 'integer',
        'hpe' => 'integer',
        'saving_hpe' => 'integer',
        'nilai_kontrak' => 'integer',
        'saving' => 'integer',
        'form_idd' => 'boolean',    
        'penilaian_idd' => 'boolean',
    ];
}