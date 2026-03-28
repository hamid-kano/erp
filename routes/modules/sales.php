<?php

use App\Modules\Sales\Web\Controllers\SalesOrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::resource('sales-orders', SalesOrderController::class)->except('edit', 'update', 'destroy');
    Route::post('sales-orders/{salesOrder}/confirm', [SalesOrderController::class, 'confirm'])->name('sales-orders.confirm');
    Route::post('sales-orders/{salesOrder}/ship',    [SalesOrderController::class, 'ship'])->name('sales-orders.ship');
    Route::post('sales-orders/{salesOrder}/cancel',  [SalesOrderController::class, 'cancel'])->name('sales-orders.cancel');
});
