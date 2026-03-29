<?php

namespace App\Modules\Sales\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Tenancy\TenantManager;
use App\Modules\Currency\Domain\Services\CurrencyService;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use Illuminate\Support\Facades\DB;

class CreateSalesOrder
{
    public function __construct(
        private TenantManager   $tenantManager,
        private InventoryService $inventoryService,
        private CurrencyService  $currencyService,
    ) {}

    public function execute(array $data): SalesOrder
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

            $order = SalesOrder::create([
                'tenant_id'     => $tenantId,
                'customer_id'   => $data['customer_id'],
                'warehouse_id'  => $data['warehouse_id'],
                'currency_id'   => $currencyId,
                'exchange_rate' => $exchangeRate,
                'number'        => DocumentSequence::next('SO'),
                'date'          => $date,
                'notes'         => $data['notes'] ?? null,
                'status'        => 'draft',
                'created_by'    => auth()->id(),
            ]);

            $total = 0;
            foreach ($data['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['unit_price'];
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total'      => $lineTotal,
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
