<?php

use App\Modules\Inventory\Web\Controllers\ItemController;
use App\Modules\Inventory\Web\Controllers\StockController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::resource('items', ItemController::class);

    Route::prefix('stock')->name('stock.')->group(function () {
        Route::get('/', [StockController::class, 'index'])->name('index');
        Route::get('/levels', [StockController::class, 'levels'])->name('levels');
        Route::post('/receive', [StockController::class, 'receive'])->name('receive');
        Route::post('/adjust', [StockController::class, 'adjust'])->name('adjust');
    });
});
