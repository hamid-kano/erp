<?php

use App\Modules\Accounting\Web\Controllers\AccountController;
use App\Modules\Accounting\Web\Controllers\JournalEntryController;
use Illuminate\Support\Facades\Route;

Route::resource('accounts', AccountController::class)->only(['index', 'create', 'store', 'edit', 'update']);
Route::resource('journal-entries', JournalEntryController::class)->only(['index', 'create', 'store', 'show']);
