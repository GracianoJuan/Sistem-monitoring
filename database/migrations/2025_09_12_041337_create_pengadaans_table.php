<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pengadaan', function (Blueprint $table) {
            $table->id();
            $table->integer('no_bantex')->nullable();
            $table->string('nama_pekerjaan');
            $table->date('tgl_nodin');
            $table->date('tgl_dokumen_lengkap')->nullable();
            $table->string('pengguna');
            $table->string('jenis');
            $table->string('metode');
            $table->bigInteger('rab')->nullable();
            $table->bigInteger('hpe')->nullable();
            $table->integer('saving_hpe')->nullable();
            $table->date('tgl_kebutuhan')->nullable();
            $table->string('progress')->nullable();
            $table->string('vendor');
            $table->date('tgl_kontrak')->nullable();
            $table->string('no_perjanjian');
            $table->bigInteger('nilai_kontrak')->nullable();
            $table->date('mulai_kontrak')->nullable();
            $table->date('akhir_kontrak')->nullable();
            $table->string('jangka_waktu')->nullable();
            $table->string('status')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('pic')->nullable();
            $table->integer('saving')->nullable();
            $table->integer('selisih_hari')->nullable();
            $table->boolean('form_idd')->nullable();
            $table->boolean('penilaian_idd')->nullable();
            // Add penilaian kinerja
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pengadaan');
    }
};
