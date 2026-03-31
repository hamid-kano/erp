<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Application\Reports\AccountStatementReport;
use App\Modules\Accounting\Application\Reports\BalanceSheetReport;
use App\Modules\Accounting\Application\Reports\GeneralLedgerReport;
use App\Modules\Accounting\Application\Reports\IncomeStatementReport;
use App\Modules\Accounting\Application\Reports\TrialBalanceReport;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\CRM\Infrastructure\Models\Customer;
use App\Modules\CRM\Infrastructure\Models\Supplier;
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
        $this->authorize('viewBalanceSheet', BalanceSheetReport::class);

        $asOf = request('as_of', now()->toDateString());

        return Inertia::render('Accounting/Reports/BalanceSheet', $report->generate($asOf));
    }

    public function generalLedger(GeneralLedgerReport $report)
    {
        $this->authorize('viewGeneralLedger', GeneralLedgerReport::class);

        $accountId = request()->integer('account_id');
        $from      = request('from', now()->startOfMonth()->toDateString());
        $to        = request('to',   now()->toDateString());

        return Inertia::render('Accounting/Reports/GeneralLedger', [
            'accounts' => Account::postable()->orderBy('_lft')->get(['id', 'code', 'name']),
            'report'   => $accountId ? $report->generate($accountId, $from, $to) : null,
            'filters'  => compact('accountId', 'from', 'to'),
        ]);
    }

    public function accountStatement(AccountStatementReport $report)
    {
        $this->authorize('viewAccountStatement', AccountStatementReport::class);

        $partyType = request('party_type', 'customer'); // customer | supplier
        $partyId   = request()->integer('party_id');
        $from      = request('from', now()->startOfMonth()->toDateString());
        $to        = request('to',   now()->toDateString());

        $party = null;
        $result = null;

        if ($partyId) {
            $party  = $partyType === 'supplier'
                ? Supplier::findOrFail($partyId)
                : Customer::findOrFail($partyId);
            $result = $report->generate($party, $from, $to);
        }

        return Inertia::render('Accounting/Reports/AccountStatement', [
            'customers' => Customer::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'report'    => $result,
            'filters'   => compact('partyType', 'partyId', 'from', 'to'),
        ]);
    }
}
