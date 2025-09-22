// app/Models/Amandemen.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amandemen extends Model
{
    use HasFactory;

    protected $table = 'amandemen';
    
    protected $fillable = [
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
        'pic',
        'nilai_perubahan'
    ];

    protected $casts = [
        'tgl_kontrak' => 'date',
        'tgl_nodin_amandemen' => 'date',
        'tgl_spa' => 'date',
        'tgl_tanggapan' => 'date',
        'tgl_amandemen' => 'date',
        'nilai_kontrak' => 'bigInteger',
        'rab_amandemen' => 'bigInteger',
        'nilai_amandemen' => 'bigInteger',
        'nilai_perubahan' => 'bigInteger',
    ];
}