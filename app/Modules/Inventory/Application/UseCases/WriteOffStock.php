<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Core\Shared\Exceptions\DomainException;
use App\Core\Tenancy\TenantManager;
use App\Modules\Inventory\Domain\DTOs\StockMovementDTO;
use App\Modules\Inventory\Domain\Events\StockWrittenOff;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\StockAdjustment;
use Illuminate\Support\Facades\DB;

class WriteOffStock
{
    public function __construct(
        private InventoryService $inventoryService,
        private TenantManager    $tenantManager,
    ) {}

    /**
     * إنشاء طلب تسوية (pending) — ينتظر موافقة المدير
     */
    public function request(array $data): StockAdjustment
    {
        return StockAdjustment::create([
            'tenant_id'       => $this->tenantManager->getId(),
            'product_id'      => $data['product_id'],
            'warehouse_id'    => $data['warehouse_id'],
            'quantity'        => $data['quantity'],
            'adjustment_type' => $data['adjustment_type'], // damage | theft | expired | count_correction
            'notes'           => $data['notes'] ?? null,
            'status'          => 'pending',
            'requested_by'    => auth()->id(),
        ]);
    }

    /**
     * موافقة المدير — تُنشئ حركة المخزون والقيد المحاسبي
     */
    public function approve(StockAdjustment $adjustment): StockAdjustment
    {
        if (! $adjustment->isPending()) {
            throw DomainException::make('هذا الطلب ليس في حالة انتظار');
        }

        return DB::transaction(function () use ($adjustment) {
            $available = $this->inventoryService->getAvailableStock(
                $adjustment->product_id,
                $adjustment->warehouse_id
            );

            if ($available < $adjustment->quantity) {
                throw DomainException::make("الكمية المتاحة ({$available}) أقل من كمية التسوية ({$adjustment->quantity})");
            }

            // حساب التكلفة عبر FIFO
            $totalCost = $this->inventoryService->consumeFifo(
                $adjustment->product_id,
                $adjustment->warehouse_id,
                $adjustment->quantity
            );

            // تسجيل حركة المخزون
            $movement = $this->inventoryService->recordMovement(new StockMovementDTO(
                product_id:   $adjustment->product_id,
                warehouse_id: $adjustment->warehouse_id,
                quantity:     -abs($adjustment->quantity),
                type:         'out',
                reason:       $adjustment->adjustment_type,
                unit_cost:    $adjustment->quantity > 0 ? $totalCost / $adjustment->quantity : 0,
                notes:        $adjustment->notes,
                reference_type: StockAdjustment::class,
                reference_id:   $adjustment->id,
            ));

            // تحديث حالة الطلب
            $adjustment->update([
                'status'      => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
                'movement_id' => $movement->id,
            ]);

            StockWrittenOff::dispatch($adjustment->fresh(), $totalCost);

            return $adjustment->fresh();
        });
    }

    /**
     * رفض الطلب
     */
    public function reject(StockAdjustment $adjustment, ?string $reason = null): StockAdjustment
    {
        if (! $adjustment->isPending()) {
            throw DomainException::make('هذا الطلب ليس في حالة انتظار');
        }

        $adjustment->update([
            'status'      => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'notes'       => $reason ?? $adjustment->notes,
        ]);

        return $adjustment->fresh();
    }
}
