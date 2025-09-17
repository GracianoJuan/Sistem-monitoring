<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengadaan extends Model
{
    use HasFactory;

    protected $table = 'pengadaan';

    protected $fillable = [
        'nama_pengadaan',
        'kode_pengadaan',
        'jenis_pengadaan',
        'nilai_kontrak',
        'tanggal_mulai',
        'tanggal_selesai',
        'penyedia_jasa',
        'pic_pengadaan',
        'status',
        'lokasi',
        'departemen',
        'kategori',
        'metode_pengadaan',
        'mata_anggaran',
        'keterangan'
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'nilai_kontrak' => 'decimal:2'
    ];
}
