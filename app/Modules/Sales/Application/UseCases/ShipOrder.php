<?php

namespace App\Modules\Sales\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Shared\Exceptions\DomainException;
use App\Core\Tenancy\TenantManager;
use App\Modules\Inventory\Application\UseCases\DeductStock;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Sales\Domain\Events\InvoiceIssued;
use App\Modules\Sales\Infrastructure\Models\Invoice;
use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use Illuminate\Support\Facades\DB;

class ShipOrder
{
    public function __construct(
        private DeductStock $deductStock,
        private InventoryService $inventoryService,
        private TenantManager $tenantManager,
    ) {}

    public function execute(SalesOrder $order): SalesOrder
    {
        if (! $order->canShip()) {
            throw DomainException::make('لا يمكن شحن هذا الطلب في حالته الحالية');
        }

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $available = $this->inventoryService->getAvailableStock(
                    $item->product_id,
                    $order->warehouse_id
                );

                if ($available < $item->quantity) {
                    throw DomainException::make(
                        "المخزون غير كافٍ للمنتج: {$item->product->name}. المتاح: {$available}"
                    );
                }

                $this->deductStock->execute(
                    productId:   $item->product_id,
                    warehouseId: $order->warehouse_id,
                    quantity:    $item->quantity,
                    refType:     SalesOrder::class,
                    refId:       $order->id,
                );
            }

            // حساب تكلفة البضاعة المباعة (COGS) عبر FIFO
            $totalCogs = 0;
            foreach ($order->items as $item) {
                $totalCogs += $this->inventoryService->consumeFifo(
                    $item->product_id,
                    $order->warehouse_id,
                    $item->quantity
                );
            }

            $order->update(['status' => 'shipped']);

            $invoice = Invoice::create([
                'tenant_id'   => $this->tenantManager->getId(),
                'customer_id' => $order->customer_id,
                'order_id'    => $order->id,
                'number'      => DocumentSequence::next('INV'),
                'date'        => now()->toDateString(),
                'due_date'    => now()->addDays(30)->toDateString(),
                'total'       => $order->total,
                'cogs'        => $totalCogs,
                'paid'        => 0,
                'status'      => 'issued',
            ]);

            InvoiceIssued::dispatch($invoice);
        });

        return $order->fresh();
    }
}
