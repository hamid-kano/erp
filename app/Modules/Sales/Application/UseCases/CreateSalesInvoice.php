<?php

namespace App\Modules\Sales\Application\UseCases;

use App\Core\DocumentSequence\DocumentSequence;
use App\Core\Shared\Exceptions\DomainException;
use App\Core\Tenancy\TenantManager;
use App\Modules\Currency\Domain\Services\CurrencyService;
use App\Modules\Inventory\Application\UseCases\DeductStock;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Sales\Domain\Events\InvoiceIssued;
use App\Modules\Sales\Infrastructure\Models\SalesInvoice;
use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use Illuminate\Support\Facades\DB;

class CreateSalesInvoice
{
    public function __construct(
        private TenantManager    $tenantManager,
        private CurrencyService  $currencyService,
        private DeductStock      $deductStock,
        private InventoryService $inventoryService,
    ) {}

    public function execute(array $data): SalesInvoice
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

            // التحقق من أمر البيع إن وجد
            $order = null;
            if (!empty($data['order_id'])) {
                $order = SalesOrder::findOrFail($data['order_id']);
                if ($order->invoice) {
                    throw new DomainException('يوجد فاتورة مرتبطة بهذا الأمر مسبقاً');
                }
            }

            $warehouseId = $data['warehouse_id'] ?? $order?->warehouse_id;

            // التحقق من المخزون قبل البدء
            foreach ($data['items'] as $item) {
                $available = $this->inventoryService->getAvailableStock($item['product_id'], $warehouseId);
                if ($available < $item['quantity']) {
                    throw new DomainException("المخزون غير كافٍ للمنتج ID: {$item['product_id']}. المتاح: {$available}");
                }
            }

            $invoice = SalesInvoice::create([
                'tenant_id'     => $tenantId,
                'customer_id'   => $data['customer_id'],
                'order_id'      => $data['order_id'] ?? null,
                'currency_id'   => $currencyId,
                'exchange_rate' => $exchangeRate,
                'number'        => DocumentSequence::next('INV'),
                'date'          => $date,
                'due_date'      => $data['due_date'] ?? null,
                'status'        => 'issued',
                'paid'          => 0,
                'notes'         => $data['notes'] ?? null,
                'created_by'    => auth()->id(),
            ]);

            $total     = 0;
            $totalCogs = 0;

            foreach ($data['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['unit_price'];

                $invoice->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total'      => $lineTotal,
                ]);

                // خصم المخزون وحساب COGS
                $this->deductStock->execute(
                    productId:   $item['product_id'],
                    warehouseId: $warehouseId,
                    quantity:    $item['quantity'],
                    refType:     SalesInvoice::class,
                    refId:       $invoice->id,
                );

                $totalCogs += $this->inventoryService->consumeFifo(
                    $item['product_id'],
                    $warehouseId,
                    $item['quantity']
                );

                $total += $lineTotal;
            }

            $invoice->update([
                'total'      => $total,
                'total_base' => round($total * $exchangeRate, 2),
                'cogs'       => $totalCogs,
            ]);

            // تحديث حالة أمر البيع
            if ($order) {
                $order->update(['status' => 'shipped']);
            }

            InvoiceIssued::dispatch($invoice);

            return $invoice->load('items.product', 'customer');
        });
    }
}
