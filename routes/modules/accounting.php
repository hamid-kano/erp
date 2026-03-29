<?php

use App\Modules\Accounting\Web\Controllers\AccountController;
use App\Modules\Accounting\Web\Controllers\JournalEntryController;
use App\Modules\Accounting\Web\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::resource('accounts', AccountController::class)->only(['index', 'create', 'store', 'edit', 'update']);
Route::post('accounts/setup-template', [AccountController::class, 'setupFromTemplate'])->name('accounts.setup-template');
Route::resource('journal-entries', JournalEntryController::class)->only(['index', 'create', 'store', 'show']);

// Reports
Route::get('reports/trial-balance', [ReportController::class, 'trialBalance'])->name('reports.trial-balance');
