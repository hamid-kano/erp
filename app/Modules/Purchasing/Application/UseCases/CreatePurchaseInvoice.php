<?php

namespace App\Modules\Purchasing\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Shared\Exceptions\DomainException;
use App\Core\Tenancy\TenantManager;
use App\Modules\Currency\Domain\Services\CurrencyService;
use App\Modules\Inventory\Application\UseCases\ReceiveStock;
use App\Modules\Purchasing\Domain\Events\GoodsReceived;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseInvoice;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class CreatePurchaseInvoice
{
    public function __construct(
        private TenantManager   $tenantManager,
        private CurrencyService  $currencyService,
        private ReceiveStock     $receiveStock,
    ) {}

    public function execute(array $data): PurchaseInvoice
    {
        return DB::transaction(function () use ($data) {
            $tenantId       = $this->tenantManager->getId();
            $baseCurrencyId = $this->tenantManager->getBaseCurrencyId();
            $currencyId     = $data['currency_id'] ?? $baseCurrencyId;
            $date           = $data['date'];

            $exchangeRate = 1.0;
            if ($currencyId && $baseCurrencyId && $currencyId !== $baseCurrencyId) {
                $exchangeRate = $this->currencyService->getRate($currencyId, $baseCurrencyId, $date);
            }

            // لو مرتبطة بأمر شراء نتحقق منه
            $order = null;
            if (!empty($data['order_id'])) {
                $order = PurchaseOrder::findOrFail($data['order_id']);
                if ($order->invoice) {
                    throw new DomainException('يوجد فاتورة مرتبطة بهذا الأمر مسبقاً');
                }
            }

            $invoice = PurchaseInvoice::create([
                'tenant_id'               => $tenantId,
                'supplier_id'             => $data['supplier_id'],
                'order_id'                => $data['order_id'] ?? null,
                'currency_id'             => $currencyId,
                'exchange_rate'           => $exchangeRate,
                'number'                  => DocumentSequence::next('PINV'),
                'supplier_invoice_number' => $data['supplier_invoice_number'] ?? null,
                'date'                    => $date,
                'due_date'                => $data['due_date'] ?? null,
                'status'                  => 'draft',
                'notes'                   => $data['notes'] ?? null,
                'created_by'              => auth()->id(),
            ]);

            $total = 0;
            $warehouseId = $data['warehouse_id'] ?? $order?->warehouse_id;

            foreach ($data['items'] as $item) {
                $lineTotal     = $item['quantity'] * $item['unit_cost'];
                $lineTotalBase = round($lineTotal * $exchangeRate, 2);

                $invoice->items()->create([
                    'product_id'     => $item['product_id'],
                    'quantity'       => $item['quantity'],
                    'unit_cost'      => $item['unit_cost'],
                    'unit_cost_base' => round($item['unit_cost'] * $exchangeRate, 2),
                    'total'          => $lineTotal,
                    'total_base'     => $lineTotalBase,
                ]);

                // استلام المخزون تلقائياً
                if ($warehouseId) {
                    $this->receiveStock->execute(
                        productId:   $item['product_id'],
                        warehouseId: $warehouseId,
                        quantity:    $item['quantity'],
                        unitCost:    round($item['unit_cost'] * $exchangeRate, 2), // بالعملة الأساسية
                        refType:     PurchaseInvoice::class,
                        refId:       $invoice->id,
                    );
                }

                $total += $lineTotal;
            }

            $invoice->update([
                'total'      => $total,
                'total_base' => round($total * $exchangeRate, 2),
                'status'     => 'posted',
            ]);

            // تحديث حالة أمر الشراء لو موجود
            if ($order) {
                $order->update(['status' => 'received']);
                GoodsReceived::dispatch($order->load('items'));
            }

            return $invoice->load('items.product', 'supplier');
        });
    }
}
