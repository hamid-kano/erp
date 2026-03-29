<?php

namespace App\Modules\Sales\Application\Listeners;

use App\Modules\Accounting\Domain\Services\PostingService;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Sales\Domain\Events\InvoiceIssued;

class HandleInvoiceIssued
{
    public function __construct(private PostingService $postingService) {}

    public function handle(InvoiceIssued $event): void
    {
        $invoice  = $event->invoice;
        $tenantId = $invoice->tenant_id;

        // حساب الذمم المدينة (1130) وإيرادات المبيعات (4100)
        $receivableAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '1130')
            ->where('is_postable', true)
            ->first();

        $revenueAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '4100')
            ->where('is_postable', true)
            ->first();

        // حساب تكلفة البضاعة المباعة (5100) والمخزون (1140)
        $cogsAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '5100')
            ->where('is_postable', true)
            ->first();

        $inventoryAccount = Account::where('tenant_id', $tenantId)
            ->where('code', '1140')
            ->where('is_postable', true)
            ->first();

        if (!$receivableAccount || !$revenueAccount) {
            return;
        }

        // قيد 1: إيراد المبيعات
        $this->postingService->post([
            'date'        => $invoice->date,
            'description' => "فاتورة مبيعات {$invoice->number}",
            'reference'   => $invoice->number,
            'lines'       => [
                [
                    'account_id' => $receivableAccount->id,
                    'debit'      => $invoice->total,
                    'credit'     => 0,
                    'description' => 'ذمم مدينة',
                ],
                [
                    'account_id' => $revenueAccount->id,
                    'debit'      => 0,
                    'credit'     => $invoice->total,
                    'description' => 'إيراد مبيعات',
                ],
            ],
        ]);

        // قيد 2: تكلفة البضاعة المباعة (لو الحسابات موجودة)
        if ($cogsAccount && $inventoryAccount && $invoice->cogs > 0) {
            $this->postingService->post([
                'date'        => $invoice->date,
                'description' => "تكلفة بضاعة مباعة - {$invoice->number}",
                'reference'   => $invoice->number,
                'lines'       => [
                    [
                        'account_id' => $cogsAccount->id,
                        'debit'      => $invoice->cogs,
                        'credit'     => 0,
                    ],
                    [
                        'account_id' => $inventoryAccount->id,
                        'debit'      => 0,
                        'credit'     => $invoice->cogs,
                    ],
                ],
            ]);
        }
    }
}
