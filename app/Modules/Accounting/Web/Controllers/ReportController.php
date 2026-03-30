<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Application\Reports\TrialBalanceReport;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function trialBalance(TrialBalanceReport $report)
    {
        abort_unless(auth()->user()->hasPermissionTo('accounting.reports.trial_balance'), 403);

        $from = request('from', now()->startOfMonth()->toDateString());
        $to   = request('to',   now()->toDateString());

        $data = $report->generate($from, $to);

        return Inertia::render('Accounting/Reports/TrialBalance', $data);
    }
}
