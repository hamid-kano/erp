<?php

namespace App\Modules\Purchasing\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Tenancy\TenantManager;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class CreatePurchaseOrder
{
    public function __construct(private TenantManager $tenantManager) {}

    public function execute(array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($data) {
            $tenantId = $this->tenantManager->getId();

            $order = PurchaseOrder::create([
                'tenant_id'    => $tenantId,
                'supplier_id'  => $data['supplier_id'],
                'warehouse_id' => $data['warehouse_id'],
                'number'       => DocumentSequence::next('PO', $tenantId),
                'date'         => $data['date'],
                'notes'        => $data['notes'] ?? null,
                'status'       => 'draft',
                'created_by'   => auth()->id(),
            ]);

            $total = 0;
            foreach ($data['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['unit_cost'];
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_cost'  => $item['unit_cost'],
                    'total'      => $lineTotal,
                ]);
                $total += $lineTotal;
            }

            $order->update(['total' => $total]);

            return $order;
        });
    }
}
