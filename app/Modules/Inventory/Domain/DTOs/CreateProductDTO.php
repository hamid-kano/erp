<?php

namespace App\Modules\Inventory\Domain\DTOs;

use App\Core\Shared\DTOs\BaseDTO;

class CreateProductDTO extends BaseDTO
{
    public function __construct(
        public readonly string $name,
        public readonly ?string $sku = null,
        public readonly ?int $category_id = null,
        public readonly ?int $unit_id = null,
        public readonly float $cost_price = 0,
        public readonly float $sell_price = 0,
        public readonly float $reorder_point = 0,
        public readonly string $cost_method = 'fifo',
    ) {}
}
