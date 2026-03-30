<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Modules\Inventory\Domain\DTOs\StockMovementDTO;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\StockMovement;

class ReceiveStock
{
    public function __construct(private InventoryService $inventoryService) {}

    public function execute(
        int $itemId,
        int $warehouseId,
        float $quantity,
        float $unitCost,
        ?string $refType = null,
        ?int $refId = null,
    ): StockMovement {
        return $this->inventoryService->recordMovement(new StockMovementDTO(
            item_id:        $itemId,
            warehouse_id:   $warehouseId,
            quantity:       abs($quantity),
            type:           'in',
            reason:         'purchase',
            unit_cost:      $unitCost,
            reference_type: $refType,
            reference_id:   $refId,
        ));
    }
}
