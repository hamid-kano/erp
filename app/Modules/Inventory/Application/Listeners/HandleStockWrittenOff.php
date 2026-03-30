<?php

namespace App\Modules\Inventory\Application\Listeners;

use App\Modules\Accounting\Domain\Services\PostingService;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Inventory\Domain\Events\StockWrittenOff;

class HandleStockWrittenOff
{
    public function __construct(private PostingService $postingService) {}

    public function handle(StockWrittenOff $event): void
    {
        $adjustment = $event->adjustment;
        $totalCost  = $event->totalCost;
        $tenantId   = $adjustment->tenant_id;

        if ($totalCost <= 0) return;

        // حساب خسائر التلف (5200) والمخزون (1140)
        $lossAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '5200')
            ->where('is_postable', true)
            ->first();

        $inventoryAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '1140')
            ->where('is_postable', true)
            ->first();

        if (! $lossAccount || ! $inventoryAccount) return;

        $typeLabels = [
            'damage'           => 'تلف',
            'theft'            => 'سرقة',
            'expired'          => 'انتهاء صلاحية',
            'count_correction' => 'تسوية جرد',
            'other'            => 'تسوية مخزون',
        ];

        $label = $typeLabels[$adjustment->adjustment_type] ?? 'تسوية مخزون';

        $this->postingService->post([
            'date'        => now()->toDateString(),
            'description' => "{$label} - {$adjustment->product->name}",
            'reference'   => "ADJ-{$adjustment->id}",
            'source_type' => \App\Modules\Inventory\Infrastructure\Models\StockAdjustment::class,
            'source_id'   => $adjustment->id,
            'lines'       => [
                [
                    'account_id'  => $lossAccount->id,
                    'debit'       => $totalCost,
                    'credit'      => 0,
                    'description' => $label,
                ],
                [
                    'account_id'  => $inventoryAccount->id,
                    'debit'       => 0,
                    'credit'      => $totalCost,
                    'description' => 'تخفيض المخزون',
                ],
            ],
        ]);
    }
}
