<?php

use App\Modules\Warehouse\Web\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::resource('warehouses', WarehouseController::class);
Route::post('warehouses/transfer', [WarehouseController::class, 'transfer'])->name('warehouses.transfer');
