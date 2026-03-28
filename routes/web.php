<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Analytics/Dashboard/Index');
});

require __DIR__.'/modules/crm.php';
require __DIR__.'/modules/inventory.php';
require __DIR__.'/modules/warehouse.php';
require __DIR__.'/modules/purchasing.php';
require __DIR__.'/modules/sales.php';
