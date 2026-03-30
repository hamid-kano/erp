<?php

namespace App\Modules\Accounting\Application\Reports;

use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalLine;
use Illuminate\Support\Facades\DB;

class BalanceSheetReport
{
    public function generate(string $asOf): array
    {
        // جلب كل الحركات حتى تاريخ معين (رصيد تراكمي)
        $balances = JournalLine::select(
                'journal_lines.account_id',
                DB::raw('SUM(journal_lines.debit_base) as debit'),
                DB::raw('SUM(journal_lines.credit_base) as credit')
            )
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.entry_id')
            ->where('journal_entries.status', 'posted')
            ->where('journal_entries.date', '<=', $asOf)
            ->groupBy('journal_lines.account_id')
            ->get()
            ->keyBy('account_id');

        $accountIds = $balances->keys();

        $accounts = Account::whereIn('id', $accountIds)
            ->whereIn('type', ['asset', 'liability', 'equity'])
            ->orderBy('_lft')
            ->get();

        $assets      = collect();
        $liabilities = collect();
        $equity      = collect();

        foreach ($accounts as $account) {
            $debit  = (float) ($balances[$account->id]->debit  ?? 0);
            $credit = (float) ($balances[$account->id]->credit ?? 0);

            // رصيد تراكمي = opening_balance + كل الحركات
            $balance = (float) $account->opening_balance
                + $account->getSignedBalance($debit, $credit);

            if (abs($balance) < 0.01) continue; // تجاهل الأرصدة الصفرية

            $row = [
                'id'      => $account->id,
                'code'    => $account->code,
                'name'    => $account->name,
                'depth'   => $account->depth,
                'balance' => $balance,
            ];

            match($account->type) {
                'asset'     => $assets->push($row),
                'liability' => $liabilities->push($row),
                'equity'    => $equity->push($row),
            };
        }

        // صافي الدخل المتراكم يُضاف لحقوق الملكية
        $netIncome = $this->getRetainedEarnings($asOf);

        $totalAssets      = $assets->sum('balance');
        $totalLiabilities = $liabilities->sum('balance');
        $totalEquity      = $equity->sum('balance') + $netIncome;
        $isBalanced       = round($totalAssets, 2) === round($totalLiabilities + $totalEquity, 2);

        return [
            'assets'            => $assets,
            'liabilities'       => $liabilities,
            'equity'            => $equity,
            'retained_earnings' => $netIncome,
            'total_assets'      => $totalAssets,
            'total_liabilities' => $totalLiabilities,
            'total_equity'      => $totalEquity,
            'is_balanced'       => $isBalanced,
            'as_of'             => $asOf,
        ];
    }

    // صافي الأرباح المتراكمة = إيرادات - مصاريف حتى التاريخ
    private function getRetainedEarnings(string $asOf): float
    {
        $balances = JournalLine::select(
                'journal_lines.account_id',
                DB::raw('SUM(journal_lines.debit_base) as debit'),
                DB::raw('SUM(journal_lines.credit_base) as credit')
            )
            ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.entry_id')
            ->join('accounts', 'accounts.id', '=', 'journal_lines.account_id')
            ->where('journal_entries.status', 'posted')
            ->where('journal_entries.date', '<=', $asOf)
            ->whereIn('accounts.type', ['revenue', 'expense'])
            ->groupBy('journal_lines.account_id', 'accounts.type', 'accounts.normal_balance')
            ->get();

        $net = 0.0;
        foreach ($balances as $row) {
            $account = Account::find($row->account_id);
            if (!$account) continue;
            $net += $account->getSignedBalance((float)$row->debit, (float)$row->credit);
        }

        return $net;
    }
}
