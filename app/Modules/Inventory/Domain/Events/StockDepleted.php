<?php

namespace App\Modules\Inventory\Domain\Events;

use App\Modules\Inventory\Infrastructure\Models\Product;
use Illuminate\Foundation\Events\Dispatchable;

class StockDepleted
{
    use Dispatchable;

    public function __construct(
        public readonly Product $product,
        public readonly int $warehouse_id,
    ) {}
}
