<?php

namespace App\Modules\Inventory\Domain\DTOs;

use App\Core\Shared\DTOs\BaseDTO;

class StockMovementDTO extends BaseDTO
{
    public function __construct(
        public readonly int $product_id,
        public readonly int $warehouse_id,
        public readonly float $quantity,
        public readonly string $type,
        public readonly float $unit_cost = 0,
        public readonly ?string $reference_type = null,
        public readonly ?int $reference_id = null,
    ) {}
}
