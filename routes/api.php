// routes/api.php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Protected routes (require Supabase authentication)
Route::middleware(['supabase.auth'])->group(function () {

    // Pengadaan routes
    Route::prefix('pengadaan')->group(function () {
        Route::get('/', [PengadaanController::class, 'index']);
        Route::post('/', [PengadaanController::class, 'store']);
        Route::get('/{pengadaan}', [PengadaanController::class, 'show']);
        Route::put('/{pengadaan}', [PengadaanController::class, 'update']);
        Route::delete('/{id}', [PengadaanController::class, 'destroy']);
    });

    // Amandemen routes  
    Route::prefix('amandemen')->group(function () {
        Route::get('/', [AmandemenController::class, 'index']);
        Route::post('/', [AmandemenController::class, 'store']);
        Route::get('/{amandemen}', [AmandemenController::class, 'show']);
        Route::put('/{amandemen}', [AmandemenController::class, 'update']);
        Route::delete('/{id}', [AmandemenController::class, 'destroy']);

        // Debug route (remove in production)
        Route::get('/{id}/check-constraints', [AmandemenController::class, 'checkConstraints']);
    });

    // User info route
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->input('auth_user'),
            'user_id' => $request->input('auth_user_id'),
            'user_email' => $request->input('auth_user_email')
        ]);
    });
});
