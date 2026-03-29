<?php

namespace App\Modules\Inventory\Domain\Services;

use App\Core\Tenancy\TenantManager;
use App\Modules\Inventory\Domain\DTOs\StockMovementDTO;
use App\Modules\Inventory\Domain\Events\StockDepleted;
use App\Modules\Inventory\Domain\Events\StockMovementRecorded;
use App\Modules\Inventory\Infrastructure\Models\CostLayer;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Inventory\Infrastructure\Models\StockMovement;
use App\Modules\Inventory\Infrastructure\Models\StockReservation;
use App\Core\Shared\Exceptions\DomainException;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function __construct(private TenantManager $tenantManager) {}

    public function recordMovement(StockMovementDTO $dto): StockMovement
    {
        return DB::transaction(function () use ($dto) {
            $movement = StockMovement::create([
                'tenant_id'      => $this->tenantManager->getId(),
                'product_id'     => $dto->product_id,
                'warehouse_id'   => $dto->warehouse_id,
                'quantity'       => $dto->quantity,
                'type'           => $dto->type,
                'unit_cost'      => $dto->unit_cost,
                'reference_type' => $dto->reference_type,
                'reference_id'   => $dto->reference_id,
                'created_by'     => auth()->id(),
            ]);

            if ($dto->type === 'in' && $dto->unit_cost > 0) {
                $this->addCostLayer($dto);
            }

            $stock = $this->getStock($dto->product_id, $dto->warehouse_id);
            if ($stock <= 0) {
                StockDepleted::dispatch(Product::find($dto->product_id), $dto->warehouse_id);
            }

            StockMovementRecorded::dispatch($movement);

            return $movement;
        });
    }

    public function getStock(int $productId, int $warehouseId): float
    {
        return (float) StockMovement::where('product_id', $productId)
            ->where('warehouse_id', $warehouseId)
            ->sum('quantity');
    }

    public function reserveStock(int $productId, int $warehouseId, float $quantity, string $refType, int $refId): void
    {
        $available = $this->getAvailableStock($productId, $warehouseId);

        if ($available < $quantity) {
            throw DomainException::make("المخزون غير كافٍ. المتاح: {$available}");
        }

        StockReservation::create([
            'tenant_id'      => $this->tenantManager->getId(),
            'product_id'     => $productId,
            'warehouse_id'   => $warehouseId,
            'quantity'       => $quantity,
            'reference_type' => $refType,
            'reference_id'   => $refId,
            'status'         => 'reserved',
        ]);
    }

    public function releaseReservation(string $refType, int $refId): void
    {
        StockReservation::where('reference_type', $refType)
            ->where('reference_id', $refId)
            ->where('status', 'reserved')
            ->update(['status' => 'released']);
    }

    public function getAvailableStock(int $productId, int $warehouseId): float
    {
        $total = $this->getStock($productId, $warehouseId);

        $reserved = (float) StockReservation::where('product_id', $productId)
            ->where('warehouse_id', $warehouseId)
            ->where('status', 'reserved')
            ->sum('quantity');

        return $total - $reserved;
    }

    public function consumeFifo(int $productId, int $warehouseId, float $quantity): float
    {
        $layers = CostLayer::where('product_id', $productId)
            ->where('warehouse_id', $warehouseId)
            ->where('remaining_quantity', '>', 0)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        $totalAvailable = $layers->sum('remaining_quantity');

        if ($totalAvailable < $quantity) {
            // لا يوجد cost layers كافية - نستخدم سعر التكلفة الافتراضي للكمية الناقصة
            $coveredCost    = 0;
            $coveredQty     = 0;
            $remaining      = $quantity;

            foreach ($layers as $layer) {
                if ($remaining <= 0) break;
                $consume        = min($remaining, $layer->remaining_quantity);
                $coveredCost   += $consume * $layer->unit_cost;
                $coveredQty    += $consume;
                $layer->decrement('remaining_quantity', $consume);
                $remaining     -= $consume;
            }

            // الكمية الناقصة نحسب لها متوسط سعر التكلفة الموجودة
            $avgCost     = $coveredQty > 0 ? $coveredCost / $coveredQty : 0;
            $missingQty  = $quantity - $coveredQty;
            $coveredCost += $missingQty * $avgCost;

            return $coveredCost;
        }

        $totalCost = 0;
        $remaining = $quantity;

        foreach ($layers as $layer) {
            if ($remaining <= 0) break;

            $consume    = min($remaining, $layer->remaining_quantity);
            $totalCost += $consume * $layer->unit_cost;
            $layer->decrement('remaining_quantity', $consume);
            $remaining -= $consume;
        }

        return $totalCost;
    }

    private function addCostLayer(StockMovementDTO $dto): void
    {
        CostLayer::create([
            'tenant_id'          => $this->tenantManager->getId(),
            'product_id'         => $dto->product_id,
            'warehouse_id'       => $dto->warehouse_id,
            'remaining_quantity' => $dto->quantity,
            'unit_cost'          => $dto->unit_cost,
            'source_type'        => $dto->reference_type,
            'source_id'          => $dto->reference_id,
        ]);
    }
}
