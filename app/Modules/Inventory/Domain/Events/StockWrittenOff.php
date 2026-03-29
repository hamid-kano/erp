<?php

namespace App\Modules\Inventory\Domain\Events;

use App\Modules\Inventory\Infrastructure\Models\StockAdjustment;
use Illuminate\Foundation\Events\Dispatchable;

class StockWrittenOff
{
    use Dispatchable;

    public function __construct(
        public readonly StockAdjustment $adjustment,
        public readonly float $totalCost,
    ) {}
}
