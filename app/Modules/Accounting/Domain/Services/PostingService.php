<?php

namespace App\Modules\Accounting\Domain\Services;

use App\Core\Shared\Exceptions\DomainException;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalEntry;
use Illuminate\Support\Facades\DB;

class PostingService
{
    /**
     * إنشاء قيد محاسبي متوازن وترحيله
     *
     * @param array $data ['date', 'description', 'reference', 'lines' => [['account_id', 'debit', 'credit']]]
     */
    public function post(array $data): JournalEntry
    {
        return DB::transaction(function () use ($data) {
            $this->assertBalanced($data['lines']);

            $entry = JournalEntry::create([
                'date'        => $data['date'],
                'description' => $data['description'],
                'reference'   => $data['reference'] ?? null,
                'status'      => 'draft',
            ]);

            foreach ($data['lines'] as $line) {
                $account = Account::findOrFail($line['account_id']);
                $account->assertCanPost();

                $entry->lines()->create([
                    'account_id'  => $account->id,
                    'debit'       => $line['debit'] ?? 0,
                    'credit'      => $line['credit'] ?? 0,
                    'description' => $line['description'] ?? null,
                ]);

                // نقفل الحساب بعد أول استخدام
                if (!$account->is_locked) {
                    $account->lock();
                }
            }

            // ترحيل القيد
            $entry->update([
                'status'    => 'posted',
                'posted_at' => now(),
            ]);

            return $entry->load('lines.account');
        });
    }

    /**
     * عكس قيد (Reversal) - لا نحذف أبداً
     */
    public function reverse(JournalEntry $entry, string $reason): JournalEntry
    {
        if ($entry->status !== 'posted') {
            throw new DomainException('لا يمكن عكس قيد غير مرحّل');
        }

        $lines = $entry->lines->map(fn($line) => [
            'account_id'  => $line->account_id,
            'debit'       => $line->credit,  // نعكس المدين والدائن
            'credit'      => $line->debit,
            'description' => "عكس: {$line->description}",
        ])->toArray();

        return $this->post([
            'date'        => now()->toDateString(),
            'description' => "عكس قيد #{$entry->id}: {$reason}",
            'reference'   => "REV-{$entry->id}",
            'lines'       => $lines,
        ]);
    }

    // ── Private ───────────────────────────────────────────

    private function assertBalanced(array $lines): void
    {
        $totalDebit  = collect($lines)->sum('debit');
        $totalCredit = collect($lines)->sum('credit');

        if (round($totalDebit, 2) !== round($totalCredit, 2)) {
            throw new DomainException(
                "القيد غير متوازن: المدين {$totalDebit} ≠ الدائن {$totalCredit}"
            );
        }

        if ($totalDebit == 0) {
            throw new DomainException('القيد لا يحتوي على مبالغ');
        }
    }
}
