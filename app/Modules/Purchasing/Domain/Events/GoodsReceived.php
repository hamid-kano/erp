<?php

namespace App\Modules\Purchasing\Domain\Events;

use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use Illuminate\Foundation\Events\Dispatchable;

class GoodsReceived
{
    use Dispatchable;

    public function __construct(public readonly PurchaseOrder $order) {}
}
