<?php

namespace App\Modules\Accounting\Application\Reports;

use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalLine;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TrialBalanceReport
{
    /**
     * يولد ميزان المراجعة لفترة معينة
     *
     * @return array{
     *   accounts: Collection,
     *   total_debit: float,
     *   total_credit: float,
     *   is_balanced: bool,
     *   from: string,
     *   to: string
     * }
     */
    public function generate(string $from, string $to): array
    {
        // نجلب مجاميع المدين والدائن لكل حساب في الفترة
        $balances = JournalLine::select(
                'account_id',
                DB::raw('SUM(debit) as total_debit'),
                DB::raw('SUM(credit) as total_credit')
            )
            ->whereHas('entry', fn($q) => $q
                ->where('status', 'posted')
                ->whereBetween('date', [$from, $to])
            )
            ->groupBy('account_id')
            ->get()
            ->keyBy('account_id');

        // نجلب الحسابات التي لها حركة فقط مرتبة بـ Nested Set
        $accountIds = $balances->keys();

        $accounts = Account::whereIn('id', $accountIds)
            ->orderBy('_lft')
            ->get()
            ->map(function ($account) use ($balances) {
                $b      = $balances[$account->id];
                $debit  = (float) $b->total_debit;
                $credit = (float) $b->total_credit;
                $balance = $account->getSignedBalance($debit, $credit);

                return [
                    'id'             => $account->id,
                    'code'           => $account->code,
                    'name'           => $account->name,
                    'type'           => $account->type,
                    'normal_balance' => $account->normal_balance,
                    'depth'          => $account->depth,
                    'debit'          => $debit,
                    'credit'         => $credit,
                    'balance'        => $balance,
                ];
            });

        $totalDebit  = $accounts->sum('debit');
        $totalCredit = $accounts->sum('credit');

        return [
            'accounts'    => $accounts,
            'total_debit' => $totalDebit,
            'total_credit'=> $totalCredit,
            'is_balanced' => round($totalDebit, 2) === round($totalCredit, 2),
            'from'        => $from,
            'to'          => $to,
        ];
    }
}
