
<?php
// routes/web.php
use App\Http\Controllers\PengadaanController;
use App\Http\Controllers\AmandemenController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

Route::prefix('api')->group(function () {
    Route::apiResource('pengadaan', PengadaanController::class);
    Route::apiResource('amandemen', AmandemenController::class);
});