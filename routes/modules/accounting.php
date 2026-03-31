<?php

use App\Modules\Accounting\Web\Controllers\AccountController;
use App\Modules\Accounting\Web\Controllers\FiscalPeriodController;
use App\Modules\Accounting\Web\Controllers\JournalEntryController;
use App\Modules\Accounting\Web\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::resource('accounts', AccountController::class)->only(['index', 'create', 'store', 'edit', 'update']);
Route::post('accounts/setup-template', [AccountController::class, 'setupFromTemplate'])->name('accounts.setup-template');
Route::resource('journal-entries', JournalEntryController::class)->only(['index', 'create', 'store', 'show']);
Route::post('journal-entries/{journalEntry}/reverse', [JournalEntryController::class, 'reverse'])->name('journal-entries.reverse');

// Fiscal Periods
Route::resource('fiscal-periods', FiscalPeriodController::class)->only(['index', 'store']);
Route::post('fiscal-periods/{fiscalPeriod}/close', [FiscalPeriodController::class, 'close'])->name('fiscal-periods.close');

// Reports
Route::get('reports/trial-balance',    [ReportController::class, 'trialBalance'])->name('reports.trial-balance');
Route::get('reports/income-statement', [ReportController::class, 'incomeStatement'])->name('reports.income-statement');
Route::get('reports/balance-sheet',    [ReportController::class, 'balanceSheet'])->name('reports.balance-sheet');
Route::get('reports/general-ledger',    [ReportController::class, 'generalLedger'])->name('reports.general-ledger');
Route::get('reports/account-statement', [ReportController::class, 'accountStatement'])->name('reports.account-statement');
