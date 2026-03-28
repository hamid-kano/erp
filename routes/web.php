<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Analytics/Dashboard/Index');
});

require __DIR__.'/modules/crm.php';
