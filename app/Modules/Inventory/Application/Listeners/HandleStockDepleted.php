<?php

namespace App\Modules\Inventory\Application\Listeners;

use App\Modules\Inventory\Domain\Events\StockDepleted;
use Illuminate\Support\Facades\Log;

class HandleStockDepleted
{
    public function handle(StockDepleted $event): void
    {
        Log::warning('Stock depleted', [
            'product_id'   => $event->product->id,
            'product_name' => $event->product->name,
            'warehouse_id' => $event->warehouse_id,
            'tenant_id'    => $event->product->tenant_id,
        ]);
        // لاحقاً: إرسال Notification للمستخدم
    }
}
