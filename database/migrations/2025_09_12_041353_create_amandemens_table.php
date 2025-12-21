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
            $table->integer('no_bantex')->nullable();
            $table->string('no_kontrak');
            $table->date('tgl_kontrak')->index();
            $table->unsignedSmallInteger('tahun_kontrak')
                ->storedAs('YEAR(tgl_kontrak)')
                ->index();
            $table->string('judul_kontrak');
            $table->bigInteger('nilai_kontrak')->nullable();
            $table->string('amandemen_ke');
            $table->string('vendor');
            $table->string('lingkup')->nullable();
            $table->date('tgl_nodin_amandemen')->nullable();
            $table->date('tgl_spa')->nullable();
            $table->date('tgl_tanggapan')->nullable();
            $table->bigInteger('rab_amandemen')->nullable();
            $table->string('no_amandemen');
            $table->date('tgl_amandemen')->nullable();
            $table->bigInteger('nilai_amandemen')->nullable();
            $table->string('progress')->nullable();
            $table->string('status')->nullable();
            $table->string('keterangan')->nullable();
            $table->string('pic')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('amandemen');
    }
};
