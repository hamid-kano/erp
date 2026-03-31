<?php

namespace App\Modules\Accounting\Application\Reports;

use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalLine;

class IncomeStatementReport
{
    public function generate(string $from, string $to): array
    {
        // جلب أرصدة حسابات الإيرادات والمصاريف في الفترة
        $balances = JournalLine::whereHas('entry', fn($q) =>
                $q->where('status', 'posted')->whereBetween('date', [$from, $to])
            )
            ->selectRaw('account_id, SUM(debit_base) as debit, SUM(credit_base) as credit')
            ->groupBy('account_id')
            ->get()
            ->keyBy('account_id');

        $accountIds = $balances->keys();

        $accounts = Account::whereIn('id', $accountIds)
            ->whereIn('type', ['revenue', 'expense'])
            ->orderBy('_lft')
            ->get();

        $revenue = collect();
        $expense = collect();

        foreach ($accounts as $account) {
            $debit  = (float) ($balances[$account->id]->debit  ?? 0);
            $credit = (float) ($balances[$account->id]->credit ?? 0);
            $amount = $account->getSignedBalance($debit, $credit);

            $row = [
                'id'     => $account->id,
                'code'   => $account->code,
                'name'   => $account->name,
                'depth'  => $account->depth,
                'amount' => $amount,
            ];

            if ($account->type === 'revenue') {
                $revenue->push($row);
            } else {
                $expense->push($row);
            }
        }

        $totalRevenue = $revenue->sum('amount');
        $totalExpense = $expense->sum('amount');
        $netIncome    = $totalRevenue - $totalExpense;

        return [
            'revenue'       => $revenue,
            'expense'       => $expense,
            'total_revenue' => $totalRevenue,
            'total_expense' => $totalExpense,
            'net_income'    => $netIncome,
            'is_profit'     => $netIncome >= 0,
            'from'          => $from,
            'to'            => $to,
        ];
    }
}
