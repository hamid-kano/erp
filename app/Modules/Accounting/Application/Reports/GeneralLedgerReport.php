<?php

namespace App\Modules\Accounting\Application\Reports;

use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalLine;

class GeneralLedgerReport
{
    public function generate(int $accountId, string $from, string $to): array
    {
        $account = Account::findOrFail($accountId);

        // رصيد أول المدة = opening_balance + حركات ما قبل الفترة
        $before = JournalLine::whereHas('entry', fn($q) =>
                $q->where('status', 'posted')->where('date', '<', $from)
            )
            ->where('account_id', $accountId)
            ->selectRaw('SUM(debit_base) as debit, SUM(credit_base) as credit')
            ->first();

        $openingBalance = (float) $account->opening_balance
            + $account->getSignedBalance((float) $before->debit, (float) $before->credit);

        // حركات الفترة مع تفاصيل القيد
        $rawLines = JournalLine::whereHas('entry', fn($q) =>
                $q->where('status', 'posted')->whereBetween('date', [$from, $to])
            )
            ->where('account_id', $accountId)
            ->with(['entry:id,number,date,description,reference'])
            ->orderBy('id')
            ->get();

        $running = $openingBalance;
        $lines = $rawLines->map(function ($line) use ($account, &$running) {
            $running += $account->getSignedBalance(
                (float) $line->debit_base,
                (float) $line->credit_base
            );

            return [
                'id'              => $line->id,
                'date'            => $line->entry->date,
                'number'          => $line->entry->number,
                'description'     => $line->description ?: $line->entry->description,
                'reference'       => $line->entry->reference,
                'debit'           => (float) $line->debit_base,
                'credit'          => (float) $line->credit_base,
                'running_balance' => $running,
            ];
        });

        return [
            'account' => [
                'id'             => $account->id,
                'code'           => $account->code,
                'name'           => $account->name,
                'type'           => $account->type,
                'normal_balance' => $account->normal_balance,
            ],
            'opening_balance' => $openingBalance,
            'closing_balance' => $running,
            'lines'           => $lines,
            'from'            => $from,
            'to'              => $to,
        ];
    }
}
