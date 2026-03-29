<?php

use App\Modules\Payments\Web\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::resource('payments', PaymentController::class)->only(['index', 'create', 'store', 'destroy']);
