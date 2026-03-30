<?php

namespace App\Modules\Purchasing\Application\Listeners;

use App\Modules\Purchasing\Domain\Events\GoodsReceived;
use Illuminate\Support\Facades\Log;

class HandleGoodsReceived
{
    public function handle(GoodsReceived $event): void
    {
        // القيد المحاسبي يُنشأ في CreatePurchaseInvoice مباشرة
        // هنا يمكن إضافة: إشعارات، تحديث إحصائيات، إلخ
        Log::info('GoodsReceived', ['order_id' => $event->order->id]);
    }
}
