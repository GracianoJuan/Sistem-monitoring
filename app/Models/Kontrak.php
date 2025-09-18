<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kontrak extends Model
{
    use HasFactory;
    protected $fillable = [
        'no_kontrak',
        'judul_kontrak',
        'tgl_kontrak',
        'nilai_kontrak'
    ];

    protected $casts = [
        'tgl_kontrak' => 'date'
    ];
}
