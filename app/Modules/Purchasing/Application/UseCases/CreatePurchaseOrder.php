<?php

namespace App\Modules\Purchasing\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Tenancy\TenantManager;
use App\Modules\Currency\Domain\Services\CurrencyService;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class CreatePurchaseOrder
{
    public function __construct(
        private TenantManager  $tenantManager,
        private CurrencyService $currencyService,
    ) {}

    public function execute(array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($data) {
            $tenantId       = $this->tenantManager->getId();
            $baseCurrencyId = $this->tenantManager->getBaseCurrencyId();
            $currencyId     = $data['currency_id'] ?? $baseCurrencyId;
            $date           = $data['date'];

            $exchangeRate = 1.0;
            if ($currencyId && $baseCurrencyId && $currencyId !== $baseCurrencyId) {
                $exchangeRate = $this->currencyService->getRate($currencyId, $baseCurrencyId, $date);
            }

            $order = PurchaseOrder::create([
                'tenant_id'     => $tenantId,
                'supplier_id'   => $data['supplier_id'],
                'warehouse_id'  => $data['warehouse_id'],
                'currency_id'   => $currencyId,
                'exchange_rate' => $exchangeRate,
                'number'        => DocumentSequence::next('PO'),
                'date'          => $date,
                'notes'         => $data['notes'] ?? null,
                'status'        => 'draft',
                'created_by'    => auth()->id(),
            ]);

            $total = 0;
            foreach ($data['items'] as $item) {
                $lineTotal     = $item['quantity'] * $item['unit_cost'];
                $lineTotalBase = round($lineTotal * $exchangeRate, 2);

                $order->items()->create([
                    'product_id'     => $item['product_id'],
                    'quantity'       => $item['quantity'],
                    'unit_cost'      => $item['unit_cost'],
                    'unit_cost_base' => round($item['unit_cost'] * $exchangeRate, 2),
                    'total'          => $lineTotal,
                    'total_base'     => $lineTotalBase,
                ]);
                $total += $lineTotal;
            }

            $order->update([
                'total'      => $total,
                'total_base' => round($total * $exchangeRate, 2),
            ]);

            return $order;
        });
    }
}
