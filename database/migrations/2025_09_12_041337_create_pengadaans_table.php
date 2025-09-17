<?php
// database/migrations/2024_01_01_000001_create_pengadaan_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pengadaan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pekerjaan');
            $table->date('tgl_nodin');
            $table->date('tgl_dokumen_lengkap')->nullable();
            $table->string('pengguna');
            $table->string('jenis');
            $table->string('metode');
            $table->bigInteger('rab')->nullable();          
            $table->date('tgl_kebutuhan')->nullable();
            $table->string('progress');
            // Vendor dari tabel kontrak
            $table->date('tgl_kontrak')->nullable();
            // Nomor perjanjian dari tabel kontrak (no_kontrak)
            // nilai kontrak dari tabel kontrak (nilai_kontrak)
            $table->date('mulai_kontrak')->nullable();
            $table->date('akhir_kontrak')->nullable();
            $table->string('jangka_waktu')->nullable();
            $table->string('status')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('pic')->nullable();
            $table->integer('saving')->nullable();
            $table->integer('selisih_hari')->nullable();
            $table->boolean('form_idd')->nullable();
            $table->boolean('penilaian_id')->nullable();
            $table->foreignId('kontrak_id')->constrained('kontrak')->onDelete('cascade');   
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pengadaan');
    }
};
