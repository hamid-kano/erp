<?php

use App\Modules\CRM\Web\Controllers\CustomerController;
use App\Modules\CRM\Web\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::resource('customers', CustomerController::class);
Route::resource('suppliers', SupplierController::class);
