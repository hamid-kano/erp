<?php

namespace App\Modules\Accounting\Domain\Services;

use App\Core\Shared\Exceptions\DomainException;
use App\Core\Tenancy\TenantManager;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalEntry;
use Illuminate\Support\Facades\DB;

class PostingService
{
    public function __construct(private TenantManager $tenantManager) {}

    public function post(array $data): JournalEntry
    {
        return DB::transaction(function () use ($data) {
            $this->assertBalanced($data['lines']);
            $this->assertMinTwoLines($data['lines']);

            $entry = JournalEntry::create([
                'tenant_id'   => $this->tenantManager->getId(),
                'date'        => $data['date'],
                'description' => $data['description'],
                'reference'   => $data['reference'] ?? null,
                'status'      => 'draft',
                'created_by'  => auth()->id(),
            ]);

            foreach ($data['lines'] as $line) {
                $debit  = (float)($line['debit']  ?? 0);
                $credit = (float)($line['credit'] ?? 0);

                if ($debit === 0.0 && $credit === 0.0) continue;

                $account = Account::findOrFail($line['account_id']);
                $account->assertCanPost();

                $entry->lines()->create([
                    'account_id'  => $account->id,
                    'debit'       => $debit,
                    'credit'      => $credit,
                    'description' => $line['description'] ?? null,
                ]);

                // نقفل الحساب فقط لو لم يكن مقفلاً بعد
                if (!$account->is_locked) {
                    $account->update(['is_locked' => true]);
                }
            }

            $entry->update([
                'status'    => 'posted',
                'posted_at' => now(),
            ]);

            return $entry->load('lines.account');
        });
    }

    public function reverse(JournalEntry $entry, string $reason): JournalEntry
    {
        $entry->assertCanReverse();

        $lines = $entry->lines->map(fn($line) => [
            'account_id'  => $line->account_id,
            'debit'       => (float)$line->credit,
            'credit'      => (float)$line->debit,
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
        $totalDebit  = collect($lines)->sum(fn($l) => (float)($l['debit']  ?? 0));
        $totalCredit = collect($lines)->sum(fn($l) => (float)($l['credit'] ?? 0));

        if (round($totalDebit, 2) !== round($totalCredit, 2)) {
            throw new DomainException(
                "القيد غير متوازن: المدين {$totalDebit} ≠ الدائن {$totalCredit}"
            );
        }

        if ($totalDebit == 0) {
            throw new DomainException('القيد لا يحتوي على مبالغ');
        }
    }

    private function assertMinTwoLines(array $lines): void
    {
        $nonZero = collect($lines)->filter(
            fn($l) => ((float)($l['debit'] ?? 0)) > 0 || ((float)($l['credit'] ?? 0)) > 0
        );

        if ($nonZero->count() < 2) {
            throw new DomainException('القيد يجب أن يحتوي على سطرين على الأقل');
        }
    }
}
