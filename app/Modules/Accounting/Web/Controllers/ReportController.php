<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Application\Reports\BalanceSheetReport;
use App\Modules\Accounting\Application\Reports\IncomeStatementReport;
use App\Modules\Accounting\Application\Reports\TrialBalanceReport;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function trialBalance(TrialBalanceReport $report)
    {
        $this->authorize('viewTrialBalance', \App\Modules\Accounting\Application\Reports\TrialBalanceReport::class);

        $from = request('from', now()->startOfMonth()->toDateString());
        $to   = request('to',   now()->toDateString());

        return Inertia::render('Accounting/Reports/TrialBalance', $report->generate($from, $to));
    }

    public function incomeStatement(IncomeStatementReport $report)
    {
        $this->authorize('viewIncomeStatement', \App\Modules\Accounting\Application\Reports\IncomeStatementReport::class);

        $from = request('from', now()->startOfYear()->toDateString());
        $to   = request('to',   now()->toDateString());

        return Inertia::render('Accounting/Reports/IncomeStatement', $report->generate($from, $to));
    }

    public function balanceSheet(BalanceSheetReport $report)
    {
        $this->authorize('viewBalanceSheet', \App\Modules\Accounting\Application\Reports\BalanceSheetReport::class);

        $asOf = request('as_of', now()->toDateString());

        return Inertia::render('Accounting/Reports/BalanceSheet', $report->generate($asOf));
    }
}
