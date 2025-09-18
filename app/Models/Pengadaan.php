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
        'pengguna',
        'jenis',
        'metode',
        'rab',
        'tgl_kebutuhan',
        'progress',
        'vendor', //temp
        'tgl_kontrak',
        'no_perjanjian', //temp
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
        'penilaian_id'
        // 'kontrak_id'
    ];

    protected $casts = [
        'tgl_nodin' => 'date',
        'tgl_dokumen_lengkap' => 'date',
        'tgl_kebutuhan' => 'date',
        'tgl_kontrak' => 'date',
        'mulai_kontrak' => 'date',
        'akhir_kontrak' => 'date',
        'selisih_hari' => 'integer',
        'nilai_kontrak' => 'decimal:2'
    ];
}
