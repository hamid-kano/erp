<?php

namespace App\Modules\Accounting\Application\Reports;

use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalLine;
use Illuminate\Support\Facades\DB;

class TrialBalanceReport
{
    public function generate(string $from, string $to): array
    {
        // ── 1. حركات ما قبل الفترة (لحساب رصيد أول المدة) ──────────
        $openingMovements = JournalLine::select(
                'account_id',
                DB::raw('SUM(debit_base) as debit'),
                DB::raw('SUM(credit_base) as credit')
            )
            ->whereHas('entry', fn($q) => $q
                ->where('status', 'posted')
                ->where('date', '<', $from)
            )
            ->groupBy('account_id')
            ->get()
            ->keyBy('account_id');

        // ── 2. حركات الفترة ──────────────────────────────────────────
        $periodMovements = JournalLine::select(
                'account_id',
                DB::raw('SUM(debit_base) as debit'),
                DB::raw('SUM(credit_base) as credit')
            )
            ->whereHas('entry', fn($q) => $q
                ->where('status', 'posted')
                ->whereBetween('date', [$from, $to])
            )
            ->groupBy('account_id')
            ->get()
            ->keyBy('account_id');

        // ── 3. جمع كل الحسابات التي لها حركة ────────────────────────
        $accountIds = $openingMovements->keys()
            ->merge($periodMovements->keys())
            ->unique();

        $accounts = Account::whereIn('id', $accountIds)
            ->orderBy('_lft')
            ->get()
            ->map(function ($account) use ($openingMovements, $periodMovements) {
                // رصيد أول المدة = opening_balance + حركات ما قبل الفترة
                $obDebit  = (float) ($openingMovements[$account->id]->debit  ?? 0);
                $obCredit = (float) ($openingMovements[$account->id]->credit ?? 0);
                $openingBalance = (float) $account->opening_balance
                    + $account->getSignedBalance($obDebit, $obCredit);

                // حركات الفترة
                $periodDebit  = (float) ($periodMovements[$account->id]->debit  ?? 0);
                $periodCredit = (float) ($periodMovements[$account->id]->credit ?? 0);

                // رصيد آخر المدة
                $closingBalance = $openingBalance
                    + $account->getSignedBalance($periodDebit, $periodCredit);

                return [
                    'id'              => $account->id,
                    'code'            => $account->code,
                    'name'            => $account->name,
                    'type'            => $account->type,
                    'normal_balance'  => $account->normal_balance,
                    'depth'           => $account->depth,
                    'opening_balance' => $openingBalance,
                    'debit'           => $periodDebit,
                    'credit'          => $periodCredit,
                    'closing_balance' => $closingBalance,
                ];
            });

        $totalDebit  = $accounts->sum('debit');
        $totalCredit = $accounts->sum('credit');

        return [
            'accounts'     => $accounts,
            'total_debit'  => $totalDebit,
            'total_credit' => $totalCredit,
            'is_balanced'  => round($totalDebit, 2) === round($totalCredit, 2),
            'from'         => $from,
            'to'           => $to,
        ];
    }
}
