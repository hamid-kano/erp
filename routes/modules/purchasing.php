<?php

use App\Modules\Purchasing\Web\Controllers\PurchaseOrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::resource('purchase-orders', PurchaseOrderController::class)->except('edit', 'update', 'destroy');
    Route::post('purchase-orders/{purchaseOrder}/confirm', [PurchaseOrderController::class, 'confirm'])->name('purchase-orders.confirm');
    Route::post('purchase-orders/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive'])->name('purchase-orders.receive');
    Route::post('purchase-orders/{purchaseOrder}/cancel',  [PurchaseOrderController::class, 'cancel'])->name('purchase-orders.cancel');
});
