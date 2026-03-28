<?php

use App\Modules\Warehouse\Web\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::resource('warehouses', WarehouseController::class)->except('show');
});
