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

    public function request(array $data): StockAdjustment
    {
        return StockAdjustment::create([
            'tenant_id'       => $this->tenantManager->getId(),
            'item_id'         => $data['item_id'],
            'warehouse_id'    => $data['warehouse_id'],
            'quantity'        => $data['quantity'],
            'adjustment_type' => $data['adjustment_type'],
            'notes'           => $data['notes'] ?? null,
            'status'          => 'pending',
            'requested_by'    => auth()->id(),
        ]);
    }

    public function approve(StockAdjustment $adjustment): StockAdjustment
    {
        if (! $adjustment->isPending()) {
            throw DomainException::make('هذا الطلب ليس في حالة انتظار');
        }

        return DB::transaction(function () use ($adjustment) {
            $available = $this->inventoryService->getAvailableStock(
                $adjustment->item_id,
                $adjustment->warehouse_id
            );

            if ($available < $adjustment->quantity) {
                throw DomainException::make("الكمية المتاحة ({$available}) أقل من كمية التسوية ({$adjustment->quantity})");
            }

            $totalCost = $this->inventoryService->consumeFifo(
                $adjustment->item_id,
                $adjustment->warehouse_id,
                $adjustment->quantity
            );

            $movement = $this->inventoryService->recordMovement(new StockMovementDTO(
                item_id:        $adjustment->item_id,
                warehouse_id:   $adjustment->warehouse_id,
                quantity:       -abs($adjustment->quantity),
                type:           'out',
                reason:         $adjustment->adjustment_type,
                unit_cost:      $adjustment->quantity > 0 ? $totalCost / $adjustment->quantity : 0,
                notes:          $adjustment->notes,
                reference_type: StockAdjustment::class,
                reference_id:   $adjustment->id,
            ));

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
