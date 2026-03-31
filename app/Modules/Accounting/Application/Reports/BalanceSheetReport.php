<?php

namespace App\Modules\Accounting\Application\Reports;

use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalLine;

class BalanceSheetReport
{
    public function generate(string $asOf): array
    {
        // جلب كل الحركات حتى تاريخ معين (رصيد تراكمي)
        $balances = JournalLine::whereHas('entry', fn($q) =>
                $q->where('status', 'posted')->where('date', '<=', $asOf)
            )
            ->selectRaw('account_id, SUM(debit_base) as debit, SUM(credit_base) as credit')
            ->groupBy('account_id')
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
        $lines = JournalLine::whereHas('entry', fn($q) =>
                $q->where('status', 'posted')->where('date', '<=', $asOf)
            )
            ->whereHas('account', fn($q) => $q->whereIn('type', ['revenue', 'expense']))
            ->selectRaw('account_id, SUM(debit_base) as debit, SUM(credit_base) as credit')
            ->groupBy('account_id')
            ->get();

        // تحميل الحسابات دفعة واحدة — يحل مشكلة N+1
        $accounts = Account::whereIn('id', $lines->pluck('account_id'))->get()->keyBy('id');

        return $lines->reduce(function (float $net, $row) use ($accounts) {
            $account = $accounts->get($row->account_id);
            return $account ? $net + $account->getSignedBalance((float)$row->debit, (float)$row->credit) : $net;
        }, 0.0);
    }
}
