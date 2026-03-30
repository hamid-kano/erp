<?php

use App\Modules\Payments\Web\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::resource('payments', PaymentController::class)->only(['index', 'store']);
Route::post('payments/{payment}/cancel', [PaymentController::class, 'cancel'])->name('payments.cancel');
Route::get('payments/pending-invoices', [PaymentController::class, 'pendingInvoices'])->name('payments.pending-invoices');
