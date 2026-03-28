<?php

namespace App\Modules\Purchasing\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Tenancy\TenantManager;
use App\Modules\Inventory\Application\UseCases\ReceiveStock;
use App\Modules\Purchasing\Domain\Events\GoodsReceived;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use App\Core\Shared\Exceptions\DomainException;
use Illuminate\Support\Facades\DB;

class ReceiveGoods
{
    public function __construct(
        private ReceiveStock $receiveStock,
        private TenantManager $tenantManager,
    ) {}

    public function execute(PurchaseOrder $order): PurchaseOrder
    {
        if (! $order->canReceive()) {
            throw DomainException::make('لا يمكن استلام هذا الطلب في حالته الحالية');
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $this->receiveStock->execute(
                    productId:   $item->product_id,
                    warehouseId: $order->warehouse_id,
                    quantity:    $item->quantity,
                    unitCost:    $item->unit_cost,
                    refType:     PurchaseOrder::class,
                    refId:       $order->id,
                );
            }

            $order->update(['status' => 'received']);

            GoodsReceived::dispatch($order);
        });

        return $order->fresh();
    }
}
