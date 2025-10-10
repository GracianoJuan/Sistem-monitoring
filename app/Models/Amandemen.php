<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amandemen extends Model
{
    use HasFactory;
    protected $table = 'amandemen';
    public $timestamps = true;
    
    protected $fillable = [
        // 'no_bantex',
        'no_kontrak',
        'tgl_kontrak',
        'judul_kontrak',
        'nilai_kontrak',
        'amandemen_ke',
        'vendor',
        'lingkup',
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
        'pic'
    ];

    protected $casts = [
        'no_bantex' => 'integer',
        'tgl_kontrak' => 'date',
        'tgl_nodin_amandemen' => 'date',
        'tgl_spa' => 'date',
        'tgl_tanggapan' => 'date',
        'tgl_amandemen' => 'date',
        'nilai_kontrak' => 'integer',  // Changed from bigInteger to integer
        'rab_amandemen' => 'integer',
        'nilai_amandemen' => 'integer'
    ];
}