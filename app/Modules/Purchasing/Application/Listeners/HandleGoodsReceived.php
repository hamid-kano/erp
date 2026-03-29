<?php

namespace App\Modules\Purchasing\Application\Listeners;

use App\Modules\Accounting\Domain\Services\PostingService;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Purchasing\Domain\Events\GoodsReceived;

class HandleGoodsReceived
{
    public function __construct(private PostingService $postingService) {}

    public function handle(GoodsReceived $event): void
    {
        $order = $event->order->load('items.product');

        // نحاول إنشاء قيد محاسبي تلقائي لو الحسابات موجودة
        $this->postPurchaseEntry($order);
    }

    private function postPurchaseEntry($order): void
    {
        $tenantId = $order->tenant_id;

        // نبحث عن حساب المخزون (1140) وحساب الموردين (2110)
        $inventoryAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '1140')
            ->where('is_postable', true)
            ->first();

        $payableAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '2110')
            ->where('is_postable', true)
            ->first();

        // لو الحسابات غير موجودة نتجاوز (tenant لم يُعد شجرة الحسابات بعد)
        if (!$inventoryAccount || !$payableAccount) {
            return;
        }

        $this->postingService->post([
            'date'        => now()->toDateString(),
            'description' => "استلام بضاعة - أمر شراء {$order->number}",
            'reference'   => $order->number,
            'lines'       => [
                [
                    'account_id' => $inventoryAccount->id,
                    'debit'      => $order->total,
                    'credit'     => 0,
                ],
                [
                    'account_id' => $payableAccount->id,
                    'debit'      => 0,
                    'credit'     => $order->total,
                ],
            ],
        ]);
    }
}
