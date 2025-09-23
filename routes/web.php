<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


Route::get('/', function () {
    return view('app');
});


// Test route
Route::get('/api/test', function () {
    return response()->json(['message' => 'API is working']);
});


// API Resources with manual prefix
Route::prefix('api')->group(function () {
    Route::apiResource('pengadaan', PengadaanController::class);
    Route::apiResource('amandemen', AmandemenController::class);

    Route::delete('/pengadaan/{pengadaan}', [PengadaanController::class, 'destroy']);
    Route::delete('/amandemen/{id}', [AmandemenController::class, 'destroy']);
});
