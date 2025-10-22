<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;
use App\Http\Controllers\DataVizController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Http\Middleware\SupabaseAuth;
use App\Http\Middleware\CheckRole;



Route::get('/', function () {
    return view('app');
});


// Test route
Route::get('/api/test', function () {
    return response()->json(['message' => 'API is working']);
});


// API Resources with manual prefix
Route::prefix('api')->group(function () {
    // Route::middleware([SupabaseAuth::class])->group(function () {

    //     // Stats endpoint - available to all authenticated users
    //     Route::get('/stats', [PengadaanController::class, 'dataStats']);

    //     // Pengadaan routes
    //     Route::get('/pengadaan', [PengadaanController::class, 'index']);
    //     Route::get('/pengadaan/{id}', [PengadaanController::class, 'show']);

    //     // Only editor and admin can create, update, delete
    //     Route::middleware([CheckRole::class . ':admin,editor'])->group(function () {
    //         Route::post('/pengadaan', [PengadaanController::class, 'store']);
    //         Route::put('/pengadaan/{id}', [PengadaanController::class, 'update']);
    //         Route::delete('/pengadaan/{id}', [PengadaanController::class, 'destroy']);
    //     });

    //     // Amandemen routes
    //     Route::get('/amandemen', [AmandemenController::class, 'index']);
    //     Route::get('/amandemen/{id}', [AmandemenController::class, 'show']);

    //     Route::middleware([CheckRole::class . ':admin,editor'])->group(function () {
    //         Route::post('/amandemen', [AmandemenController::class, 'store']);
    //         Route::put('/amandemen/{id}', [AmandemenController::class, 'update']);
    //         Route::delete('/amandemen/{id}', [AmandemenController::class, 'destroy']);
    //     });

    //     // User management routes - only admin
    //     Route::middleware([CheckRole::class . ':admin'])->group(function () {
    //         Route::get('/users', [UserController::class, 'index']);
    //         Route::get('/users/{id}', [UserController::class, 'show']);
    //         Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    //         Route::delete('/users/{id}', [UserController::class, 'destroy']);
    //     });
    // });
    // Stats endpoint - available to all authenticated users
    Route::get('/stats', [PengadaanController::class, 'dataStats']);

    // Pengadaan routes
    Route::get('/pengadaan', [PengadaanController::class, 'index']);
    Route::get('/pengadaan/{id}', [PengadaanController::class, 'show']);

    // Only editor and admin can create, update, delete
    Route::middleware([CheckRole::class . ':admin,editor'])->group(function () {
        Route::post('/pengadaan', [PengadaanController::class, 'store']);
        Route::put('/pengadaan/{id}', [PengadaanController::class, 'update']);
        Route::delete('/pengadaan/{id}', [PengadaanController::class, 'destroy']);
    });

    // Amandemen routes
    Route::get('/amandemen', [AmandemenController::class, 'index']);
    Route::get('/amandemen/{id}', [AmandemenController::class, 'show']);

    Route::middleware([CheckRole::class . ':admin,editor'])->group(function () {
        Route::post('/amandemen', [AmandemenController::class, 'store']);
        Route::put('/amandemen/{id}', [AmandemenController::class, 'update']);
        Route::delete('/amandemen/{id}', [AmandemenController::class, 'destroy']);
    });

    Route::get('/users', [UserController::class, 'index']);
    // User management routes - only admin
    Route::get('/datasum', [DataVizController::class, 'getSummary']);
    Route::middleware([CheckRole::class . ':admin'])->group(function () {
        // Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});


Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');
