<?php

namespace App\Modules\Inventory\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Application\UseCases\AdjustStock;
use App\Modules\Inventory\Application\UseCases\ReceiveStock;
use App\Modules\Inventory\Domain\Services\InventoryService;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Inventory\Web\Requests\StockMovementRequest;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(): Response
    {
        $stock = Product::with(['category', 'unit'])
            ->where('is_active', true)
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Inventory/Stock/Index', [
            'stock' => $stock,
        ]);
    }

    public function receive(StockMovementRequest $request, ReceiveStock $useCase)
    {
        $useCase->execute(
            productId:   $request->product_id,
            warehouseId: $request->warehouse_id,
            quantity:    $request->quantity,
            unitCost:    $request->unit_cost ?? 0,
        );

        return back()->with('success', 'تم استلام المخزون بنجاح');
    }

    public function adjust(StockMovementRequest $request, AdjustStock $useCase)
    {
        $useCase->execute(
            productId:   $request->product_id,
            warehouseId: $request->warehouse_id,
            newQuantity: $request->quantity,
            unitCost:    $request->unit_cost ?? 0,
        );

        return back()->with('success', 'تم تعديل المخزون بنجاح');
    }

    public function levels(InventoryService $inventoryService): Response
    {
        $warehouses = Warehouse::all(['id', 'name']);

        $lowStock = Product::active()
            ->withStock()
            ->with('unit')
            ->get()
            ->filter(fn ($p) => $p->isLowStock())
            ->values();

        return Inertia::render('Inventory/Stock/Levels', [
            'warehouses' => $warehouses,
            'lowStock'   => $lowStock,
        ]);
    }
}
