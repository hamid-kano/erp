<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth.php';

Route::middleware(['auth', \App\Core\Tenancy\Middleware\InitializeTenant::class])->group(function () {
    Route::get('/', [\App\Modules\Analytics\Web\Controllers\DashboardController::class, 'index'])->name('dashboard');

    require __DIR__.'/modules/crm.php';
    require __DIR__.'/modules/inventory.php';
    require __DIR__.'/modules/warehouse.php';
    require __DIR__.'/modules/purchasing.php';
    require __DIR__.'/modules/sales.php';
    require __DIR__.'/modules/payments.php';
    require __DIR__.'/modules/accounting.php';
});
