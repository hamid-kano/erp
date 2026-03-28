<?php

namespace App\Modules\Inventory\Domain\Events;

use App\Modules\Inventory\Infrastructure\Models\StockMovement;
use Illuminate\Foundation\Events\Dispatchable;

class StockMovementRecorded
{
    use Dispatchable;

    public function __construct(public readonly StockMovement $movement) {}
}
