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
        abort_unless(auth()->user()->hasPermissionTo('accounting.reports.trial_balance'), 403);

        $from = request('from', now()->startOfMonth()->toDateString());
        $to   = request('to',   now()->toDateString());

        return Inertia::render('Accounting/Reports/TrialBalance', $report->generate($from, $to));
    }

    public function incomeStatement(IncomeStatementReport $report)
    {
        abort_unless(auth()->user()->hasPermissionTo('accounting.reports.income_statement'), 403);

        $from = request('from', now()->startOfYear()->toDateString());
        $to   = request('to',   now()->toDateString());

        return Inertia::render('Accounting/Reports/IncomeStatement', $report->generate($from, $to));
    }

    public function balanceSheet(BalanceSheetReport $report)
    {
        abort_unless(auth()->user()->hasPermissionTo('accounting.reports.balance_sheet'), 403);

        $asOf = request('as_of', now()->toDateString());

        return Inertia::render('Accounting/Reports/BalanceSheet', $report->generate($asOf));
    }
}
