<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;
use App\Http\Controllers\DataVizController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\DBAuth;
use Dflydev\DotAccessData\Data;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BulkImportController;

Route::get('/', function () {
    return view('app');
});

// Test route
Route::get('/api/test', function () {
    return response()->json(['message' => 'API is working']);
});

// API Resources with manual prefix
Route::prefix('api')->group(function () {
    Route::post('/pengadaan/bulk', [BulkImportController::class, 'importPengadaan']);
    Route::post('/amandemen/bulk', [BulkImportController::class, 'importAmandemen']);
    // User routes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    // Pengadaan routes
    Route::get('/pengadaan', [PengadaanController::class, 'index']);
    Route::get('/pengadaan/{id}', [PengadaanController::class, 'show']);
    Route::post('/pengadaan', [PengadaanController::class, 'store']);
    Route::put('/pengadaan/{id}', [PengadaanController::class, 'update']);
    Route::delete('/pengadaan/{id}', [PengadaanController::class, 'destroy']);
    Route::get('/pengadaan-years', [PengadaanController::class, 'getAvailableYears']);
    
    // Amandemen routes
    Route::get('/amandemen', [AmandemenController::class, 'index']);
    Route::get('/amandemen/{id}', [AmandemenController::class, 'show']);
    Route::post('/amandemen', [AmandemenController::class, 'store']);
    Route::put('/amandemen/{id}', [AmandemenController::class, 'update']);
    Route::delete('/amandemen/{id}', [AmandemenController::class, 'destroy']);
    Route::get('/amandemen-years', [AmandemenController::class, 'getAvailableYears']);

    // Stats and data visualization
    Route::get('/stats', [PengadaanController::class, 'dataStats']);
    Route::get('/datasum', [DataVizController::class, 'index']);
    Route::get('/get-year', [DataVizController::class, 'getAvailableYears']);

    Route::middleware([DBAuth::class])->group(function () {
    });
});

// Auth routes (public)
Route::prefix('api/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/confirm', [AuthController::class, 'confirm']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/forgot', [AuthController::class, 'sendReset']);
    Route::get('/verify-reset', [AuthController::class, 'verifyReset']);
    Route::post('/update-password', [AuthController::class, 'updatePassword']);
    Route::get('/me', [AuthController::class, 'me']);
    

});



Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');