<?php

namespace App\Modules\Warehouse\Domain\Events;

use Illuminate\Foundation\Events\Dispatchable;

class StockTransferred
{
    use Dispatchable;

    public function __construct(
        public readonly int    $productId,
        public readonly int    $fromWarehouseId,
        public readonly int    $toWarehouseId,
        public readonly float  $quantity,
        public readonly string $tenantId,
    ) {}
}
