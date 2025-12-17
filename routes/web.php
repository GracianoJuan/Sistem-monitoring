<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;
use App\Http\Controllers\DataVizController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\DBAuth;



Route::get('/', function () {
    return view('app');
});


// Test route
Route::get('/api/test', function () {
    return response()->json(['message' => 'API is working']);
});



// API Resources with manual prefix
Route::prefix('api')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/amandemen', [AmandemenController::class, 'store']);
    Route::put('/amandemen/{id}', [AmandemenController::class, 'update']);
    Route::delete('/amandemen/{id}', [AmandemenController::class, 'destroy']);
    // Amandemen routes
    Route::get('/amandemen', [AmandemenController::class, 'index']);
    Route::get('/amandemen/{id}', [AmandemenController::class, 'show']);

    Route::post('/pengadaan', [PengadaanController::class, 'store']);
    Route::put('/pengadaan/{id}', [PengadaanController::class, 'update']);
    Route::delete('/pengadaan/{id}', [PengadaanController::class, 'destroy']);
    Route::get('/stats', [PengadaanController::class, 'dataStats']);
    Route::get('/datasum', [DataVizController::class, 'index']);

    // Pengadaan routes
    Route::get('/pengadaan', [PengadaanController::class, 'index']);
    Route::get('/pengadaan/{id}', [PengadaanController::class, 'show']);

    // Use DBAuth middleware (session cookie or bearer token)
    // Route::middleware([DBAuth::class])->group(function () {

    //     // Stats endpoint - available to all authenticated users
    //     Route::get('/stats', [PengadaanController::class, 'dataStats']);
    //     Route::get('/datasum', [DataVizController::class, 'index']);

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

        // User management routes - only admin
        // Route::middleware([CheckRole::class . ':admin'])->group(function () {
        //     Route::get('/users', [UserController::class, 'index']);
        //     Route::get('/users/{id}', [UserController::class, 'show']);
        //     Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        //     Route::delete('/users/{id}', [UserController::class, 'destroy']);
        // });
        // Route::get('/users', [UserController::class, 'index']);
        // Route::get('/users/{id}', [UserController::class, 'show']);
        // Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        // Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Route::get('/users', [UserController::class, 'index']);
        // Route::get('/users/{id}', [UserController::class, 'show']);
        // Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        // Route::delete('/users/{id}', [UserController::class, 'destroy']);
    // }
// );
});

// Auth routes (public)
Route::prefix('api/auth')->group(function () {
    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
    Route::get('/confirm', [\App\Http\Controllers\AuthController::class, 'confirm']);
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::post('/forgot', [\App\Http\Controllers\AuthController::class, 'sendReset']);
    Route::get('/verify-reset', [\App\Http\Controllers\AuthController::class, 'verifyReset']);
    Route::get('/me', [\App\Http\Controllers\AuthController::class, 'me']);
    Route::post('/reset', [\App\Http\Controllers\AuthController::class, 'updatePassword']);
});


Route::get('{any}', function () {
    return view('app');
})->where('any', '.*');
