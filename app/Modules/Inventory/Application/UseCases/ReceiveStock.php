<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Modules\Inventory\Domain\DTOs\StockMovementDTO;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\StockMovement;

class ReceiveStock
{
    public function __construct(private InventoryService $inventoryService) {}

    public function execute(
        int $productId,
        int $warehouseId,
        float $quantity,
        float $unitCost,
        ?string $refType = null,
        ?int $refId = null,
    ): StockMovement {
        return $this->inventoryService->recordMovement(new StockMovementDTO(
            product_id:     $productId,
            warehouse_id:   $warehouseId,
            quantity:       abs($quantity),
            type:           'in',
            unit_cost:      $unitCost,
            reference_type: $refType,
            reference_id:   $refId,
        ));
    }
}
