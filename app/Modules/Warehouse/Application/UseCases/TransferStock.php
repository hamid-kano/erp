<?php

namespace App\Modules\Warehouse\Application\UseCases;

use App\Core\Shared\Exceptions\DomainException;
use App\Core\Tenancy\TenantManager;
use App\Modules\Inventory\Domain\DTOs\StockMovementDTO;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Warehouse\Domain\Events\StockTransferred;
use Illuminate\Support\Facades\DB;

class TransferStock
{
    public function __construct(
        private InventoryService $inventoryService,
        private TenantManager    $tenantManager,
    ) {}

    public function execute(
        int   $itemId,
        int   $fromWarehouseId,
        int   $toWarehouseId,
        float $quantity,
        float $unitCost = 0,
    ): void {
        if ($fromWarehouseId === $toWarehouseId) {
            throw new DomainException('المستودع المصدر والهدف متطابقان');
        }

        if ($quantity <= 0) {
            throw new DomainException('الكمية يجب أن تكون أكبر من صفر');
        }

        $available = $this->inventoryService->getAvailableStock($itemId, $fromWarehouseId);

        if ($available < $quantity) {
            throw new DomainException("المخزون غير كافٍ. المتاح: {$available}");
        }

        DB::transaction(function () use ($itemId, $fromWarehouseId, $toWarehouseId, $quantity, $unitCost) {
            $tenantId = $this->tenantManager->getId();

            $this->inventoryService->recordMovement(new StockMovementDTO(
                item_id:        $itemId,
                warehouse_id:   $fromWarehouseId,
                quantity:       -$quantity,
                type:           'transfer',
                unit_cost:      $unitCost,
                reference_type: 'transfer',
                reference_id:   null,
            ));

            $this->inventoryService->recordMovement(new StockMovementDTO(
                item_id:        $itemId,
                warehouse_id:   $toWarehouseId,
                quantity:       $quantity,
                type:           'transfer',
                unit_cost:      $unitCost,
                reference_type: 'transfer',
                reference_id:   null,
            ));

            StockTransferred::dispatch($itemId, $fromWarehouseId, $toWarehouseId, $quantity, $tenantId);
        });
    }
}
