<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amandemen extends Model
{
    use HasFactory;

    protected $table = 'amandemen';

    protected $fillable = [
        'nama_amandemen',
        'kode_amandemen',
        'pengadaan_id',
        'jenis_amandemen',
        'nilai_perubahan',
        'tanggal_amandemen',
        'tanggal_efektif',
        'alasan_amandemen',
        'pic_amandemen',
        'status_approval',
        'dokumen_pendukung',
        'revisi_ke',
        'dampak_waktu',
        'dampak_biaya',
        'keterangan_tambahan'
    ];

    protected $casts = [
        'tanggal_amandemen' => 'date',
        'tanggal_efektif' => 'date',
        'nilai_perubahan' => 'decimal:2'
    ];

    public function pengadaan()
    {
        return $this->belongsTo(Pengadaan::class);
    }
}