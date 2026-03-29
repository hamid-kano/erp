<?php

namespace App\Modules\Warehouse\Web\Controllers;

use App\Core\AuditLog\AuditLog;
use App\Http\Controllers\Controller;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Warehouse\Application\UseCases\TransferStock;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function index(): Response
    {
        $warehouses = Warehouse::withCount('locations')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('Warehouse/Index', ['warehouses' => $warehouses]);
    }

    public function create(): Response
    {
        return Inertia::render('Warehouse/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'city'      => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ]);

        $warehouse = Warehouse::create($data);
        AuditLog::record('created', $warehouse, [], $warehouse->toArray());

        return redirect()->route('warehouses.index')
            ->with('success', "تم إضافة المستودع {$warehouse->name} بنجاح");
    }

    public function show(Warehouse $warehouse): Response
    {
        // المخزون في هذا المستودع
        $stock = Product::active()
            ->withSum(['stockMovements' => fn($q) => $q->where('warehouse_id', $warehouse->id)], 'quantity')
            ->having('stock_movements_sum_quantity', '>', 0)
            ->with('unit')
            ->get()
            ->map(fn($p) => [
                'id'       => $p->id,
                'name'     => $p->name,
                'sku'      => $p->sku,
                'quantity' => (float)$p->stock_movements_sum_quantity,
                'unit'     => $p->unit?->symbol,
            ]);

        return Inertia::render('Warehouse/Show', [
            'warehouse' => $warehouse->load('locations'),
            'stock'     => $stock,
        ]);
    }

    public function edit(Warehouse $warehouse): Response
    {
        return Inertia::render('Warehouse/Form', ['warehouse' => $warehouse]);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $data = $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'city'      => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
        ]);

        $old = $warehouse->toArray();
        $warehouse->update($data);
        AuditLog::record('updated', $warehouse, $old, $warehouse->toArray());

        return redirect()->route('warehouses.index')
            ->with('success', 'تم تحديث المستودع بنجاح');
    }

    public function destroy(Warehouse $warehouse)
    {
        AuditLog::record('deleted', $warehouse, $warehouse->toArray(), []);
        $warehouse->delete();

        return redirect()->route('warehouses.index')
            ->with('success', 'تم حذف المستودع بنجاح');
    }

    public function transfer(Request $request, TransferStock $useCase)
    {
        $request->validate([
            'product_id'        => ['required', 'exists:products,id'],
            'from_warehouse_id' => ['required', 'exists:warehouses,id'],
            'to_warehouse_id'   => ['required', 'exists:warehouses,id', 'different:from_warehouse_id'],
            'quantity'          => ['required', 'numeric', 'min:0.001'],
        ]);

        $useCase->execute(
            productId:       $request->product_id,
            fromWarehouseId: $request->from_warehouse_id,
            toWarehouseId:   $request->to_warehouse_id,
            quantity:        $request->quantity,
        );

        return back()->with('success', 'تم نقل المخزون بنجاح');
    }
}
