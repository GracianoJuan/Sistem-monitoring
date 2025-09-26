<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengadaan extends Model
{
    use HasFactory;

    protected $table = 'pengadaan';
    
    protected $fillable = [
        'nama_pekerjaan',
        'tgl_nodin',
        'tgl_dokumen_lengkap',
        'jenis',
        'metode',
        'rab',
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
    ];

    protected $casts = [
        'tgl_nodin' => 'date',
        'tgl_dokumen_lengkap' => 'date',
        'tgl_kontrak' => 'date',
        'mulai_kontrak' => 'date',
        'akhir_kontrak' => 'date',
        'rab' => 'integer',
        'nilai_kontrak' => 'integer',
        'saving' => 'integer',
        'form_idd' => 'boolean',    
        'penilaian_idd' => 'boolean',
    ];
}