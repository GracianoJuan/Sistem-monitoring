// routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Pengadaan routes
Route::apiResource('pengadaan', PengadaanController::class);

// Amandemen routes
Route::apiResource('amandemen', AmandemenController::class);