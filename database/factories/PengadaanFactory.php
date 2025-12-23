<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pengadaan>
 */
class PengadaanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'no_bantex' => $this->faker->randomNumber(),
            'nama_pekerjaan' => $this->faker->sentence(),
            'tgl_nodin' => $this->faker->date(),
            'tgl_dokumen_lengkap' => $this->faker->date(),
            'pengguna' => $this->faker->name(),
            'jenis' => $this->faker->word(),
            'metode' => $this->faker->word(),
            'rab' => $this->faker->randomNumber(),
            'hpe' => $this->faker->randomNumber(),
            'saving_hpe' => $this->faker->randomNumber(),
            'tgl_kebutuhan' => $this->faker->date(),
            'progress' => $this->faker->word(),
            'vendor' => $this->faker->company(),
            'tgl_kontrak' => $this->faker->date(),
            'no_perjanjian' => $this->faker->bothify('????-####'),
            'nilai_kontrak' => $this->faker->randomNumber(),
            'mulai_kontrak' => $this->faker->date(),
            'akhir_kontrak' => $this->faker->date(),
            'jangka_waktu' => $this->faker->word(),
            'status' => $this->faker->word(),
            'keterangan' => $this->faker->sentence(),
            'pic' => $this->faker->name(),
            'saving' => $this->faker->randomNumber(),
            'selisih_hari' => $this->faker->randomNumber(),
            'form_idd' => $this->faker->boolean(),
            'penilaian_idd' => $this->faker->boolean()
        ];
    }
}
