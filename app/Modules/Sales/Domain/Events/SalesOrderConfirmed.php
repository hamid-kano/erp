<?php

namespace App\Modules\Sales\Domain\Events;

use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use Illuminate\Foundation\Events\Dispatchable;

class SalesOrderConfirmed
{
    use Dispatchable;
    public function __construct(public readonly SalesOrder $order) {}
}
