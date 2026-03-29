<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/', fn() => Inertia::render('Analytics/Dashboard/Index'))->name('dashboard');

    require __DIR__.'/modules/crm.php';
    require __DIR__.'/modules/inventory.php';
    require __DIR__.'/modules/warehouse.php';
    require __DIR__.'/modules/purchasing.php';
    require __DIR__.'/modules/sales.php';
});
