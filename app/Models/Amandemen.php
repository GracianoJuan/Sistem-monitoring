<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amandemen extends Model
{
    use HasFactory;

    protected $table = 'amandemen';

    protected $fillable = [
        'no_kontrak', //temp
        'tgl_kontrak',
        'judul_kontrak',
        'nilai_kontrak', //temp
        'amandemen_ke',
        'lingkup',
        'vendor', //temp
        'tgl_nodin_amandemen',
        'tgl_spa',
        'tgl_tanggapan',
        'rab_amandemen',
        'no_amandemen',
        'tgl_amandemen',
        'nilai_amandemen',
        'progress',
        'status',
        'keterangan',
        'pic',
        'pengadaan_id',
        // 'kontrak_id'
    ];

    protected $casts = [
        'tgl_kontrak' => 'date',
        'tgl_nodin_amandemen' => 'date',
        'tgl_spa' => 'date',
        'tgl_tanggapan' => 'date',
        'tgl_amandemen' => 'date',
        'nilai_perubahan' => 'decimal:2'
    ];

    public function pengadaan()
    {
        return $this->belongsTo(Pengadaan::class);
    }
}