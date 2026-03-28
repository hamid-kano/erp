<?php

namespace App\Modules\Sales\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Tenancy\TenantManager;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Sales\Domain\Events\SalesOrderConfirmed;
use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use Illuminate\Support\Facades\DB;

class CreateSalesOrder
{
    public function __construct(
        private TenantManager $tenantManager,
        private InventoryService $inventoryService,
    ) {}

    public function execute(array $data): SalesOrder
    {
        return DB::transaction(function () use ($data) {
            $tenantId = $this->tenantManager->getId();

            $order = SalesOrder::create([
                'tenant_id'    => $tenantId,
                'customer_id'  => $data['customer_id'],
                'warehouse_id' => $data['warehouse_id'],
                'number'       => DocumentSequence::next('SO', $tenantId),
                'date'         => $data['date'],
                'notes'        => $data['notes'] ?? null,
                'status'       => 'draft',
                'created_by'   => auth()->id(),
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

            $order->update(['total' => $total]);

            return $order;
        });
    }
}
