<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('amandemen', function (Blueprint $table) {
            $table->id();
            $table->string('no_kontrak');// nomor kontrak dari tabel kontrak
            $table->date('tgl_kontrak');
            $table->string('judul_kontrak');
            $table->bigInteger('nilai_kontrak');// Nilai kontrak dari tabel kontrak
            $table->string('amandemen_ke');
            $table->string('vendor');// Vendor dari tabel kontrak
            $table->string('lingkup')->nullable();
            $table->date('tgl_nodin_amandemen')->nullable();
            $table->date('tgl_spa')->nullable();        //spa = surat persetujuan amandemen
            $table->date('tgl_tanggapan')->nullable();
            $table->bigInteger('rab_amandemen')->nullable();
            $table->string('no_amandemen');
            $table->date('tgl_amandemen')->nullable();
            $table->bigInteger('nilai_amandemen')->nullable();
            $table->string('progress')->nullable();
            $table->string('status')->nullable();
            $table->string('keterangan')->nullable();
            $table->string('pic')->nullable();          //person in charge
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('amandemen');
    }
};