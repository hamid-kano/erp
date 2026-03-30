<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Modules\Inventory\Domain\DTOs\StockMovementDTO;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\StockMovement;

class DeductStock
{
    public function __construct(private InventoryService $inventoryService) {}

    public function execute(
        int $itemId,
        int $warehouseId,
        float $quantity,
        ?string $refType = null,
        ?int $refId = null,
    ): StockMovement {
        $cogs = $this->inventoryService->consumeFifo($itemId, $warehouseId, $quantity);

        return $this->inventoryService->recordMovement(new StockMovementDTO(
            item_id:        $itemId,
            warehouse_id:   $warehouseId,
            quantity:       -abs($quantity),
            type:           'out',
            reason:         'sale',
            unit_cost:      $quantity > 0 ? $cogs / $quantity : 0,
            reference_type: $refType,
            reference_id:   $refId,
        ));
    }
}
