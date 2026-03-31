<?php

namespace App\Modules\Accounting\Application\Reports;

use App\Modules\Accounting\Infrastructure\Models\JournalEntry;
use App\Modules\Accounting\Infrastructure\Models\JournalLine;
use App\Modules\Accounting\Infrastructure\Models\Account;
use Illuminate\Database\Eloquent\Model;

class AccountStatementReport
{
    /**
     * كشف حساب عميل أو مورد
     *
     * يعتمد على القيود المحاسبية المرتبطة بالطرف (source_type/source_id)
     * مع حساب الرصيد الجاري لكل حركة.
     *
     * @param  Model  $party   Customer أو Supplier
     * @param  string $from
     * @param  string $to
     * @param  int|null $accountId  حساب الطرف في دليل الحسابات (اختياري للفلترة)
     */
    public function generate(Model $party, string $from, string $to, ?int $accountId = null): array
    {
        $partyType = get_class($party);

        // رصيد أول المدة من القيود المرتبطة بهذا الطرف قبل الفترة
        $beforeQuery = JournalEntry::where('source_type', $partyType)
            ->where('source_id', $party->id)
            ->where('status', 'posted')
            ->where('date', '<', $from);

        $openingBalance = $this->calcBalance($beforeQuery->pluck('id'), $accountId);

        // قيود الفترة
        $entries = JournalEntry::where('source_type', $partyType)
            ->where('source_id', $party->id)
            ->where('status', 'posted')
            ->whereBetween('date', [$from, $to])
            ->with(['lines' => fn($q) => $accountId
                ? $q->where('account_id', $accountId)
                : $q
            ])
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        $running = $openingBalance;
        $lines   = collect();

        foreach ($entries as $entry) {
            $debit  = $entry->lines->sum('debit_base');
            $credit = $entry->lines->sum('credit_base');
            $running += (float)$debit - (float)$credit;

            $lines->push([
                'id'              => $entry->id,
                'date'            => $entry->date,
                'number'          => $entry->number,
                'description'     => $entry->description,
                'reference'       => $entry->reference,
                'debit'           => (float) $debit,
                'credit'          => (float) $credit,
                'running_balance' => $running,
            ]);
        }

        return [
            'party'           => [
                'id'   => $party->id,
                'name' => $party->name,
                'type' => class_basename($partyType),
            ],
            'opening_balance' => $openingBalance,
            'closing_balance' => $running,
            'total_debit'     => $lines->sum('debit'),
            'total_credit'    => $lines->sum('credit'),
            'lines'           => $lines,
            'from'            => $from,
            'to'              => $to,
        ];
    }

    private function calcBalance(\Illuminate\Support\Collection $entryIds, ?int $accountId): float
    {
        if ($entryIds->isEmpty()) return 0.0;

        $query = JournalLine::whereIn('entry_id', $entryIds);

        if ($accountId) {
            $query->where('account_id', $accountId);
        }

        $debit  = (float) $query->sum('debit_base');
        $credit = (float) $query->sum('credit_base');

        return $debit - $credit;
    }
}
