<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Modules\Inventory\Domain\DTOs\StockMovementDTO;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\StockMovement;

class AdjustStock
{
    public function __construct(private InventoryService $inventoryService) {}

    public function execute(
        int $itemId,
        int $warehouseId,
        float $newQuantity,
        float $unitCost = 0,
    ): StockMovement {
        $current = $this->inventoryService->getStock($itemId, $warehouseId);
        $diff = $newQuantity - $current;

        return $this->inventoryService->recordMovement(new StockMovementDTO(
            item_id:      $itemId,
            warehouse_id: $warehouseId,
            quantity:     $diff,
            type:         'adjustment',
            unit_cost:    $unitCost,
        ));
    }
}
