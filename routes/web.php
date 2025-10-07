<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;
use Illuminate\Http\Request;


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

    Route::delete('/pengadaan/{id}', [PengadaanController::class, 'destroy']);
    Route::delete('/amandemen/{id}', [AmandemenController::class, 'destroy']);
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->input('auth_user'),
            'user_id' => $request->input('auth_user_id'),
            'user_email' => $request->input('auth_user_email')
        ]);
    });
    Route::get('/stats', [PengadaanController::class, 'dataStats']);
});
