<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('app');
});

/*
|--------------------------------------------------------------------------
| API Routes (in web.php because api.php is not loaded)
|--------------------------------------------------------------------------
*/

// Test route
Route::get('/api/test', function () {
    return response()->json(['message' => 'API is working']);
});


// API Resources with manual prefix
Route::prefix('api')->group(function () {
    Route::apiResource('pengadaan', PengadaanController::class);
    Route::apiResource('amandemen', AmandemenController::class);
});
Route::get('/debug-amandemen', function () {
    try {
        // Check if table exists
        $tableExists = Schema::hasTable('amandemen');
        
        // Check table structure
        $columns = Schema::getColumnListing('amandemen');
        
        // Try to get count
        $count = DB::table('amandemen')->count();
        
        // Try with Eloquent
        $eloquentCount = \App\Models\Amandemen::count();
        
        return response()->json([
            'table_exists' => $tableExists,
            'columns' => $columns,
            'raw_count' => $count,
            'eloquent_count' => $eloquentCount,
            'first_record' => DB::table('amandemen')->first()
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
    }
});