<?php

namespace App\Modules\Purchasing\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Infrastructure\Models\Supplier;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Purchasing\Application\UseCases\CreatePurchaseOrder;
use App\Modules\Purchasing\Application\UseCases\ReceiveGoods;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(): Response
    {
        $orders = PurchaseOrder::with(['supplier', 'warehouse'])
            ->when(request('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Purchasing/Index', [
            'orders'  => $orders,
            'filters' => request()->only('status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Purchasing/Form', [
            'suppliers'  => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'warehouses' => Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'products'   => Product::where('is_active', true)->orderBy('name')->get(['id', 'name', 'sku', 'cost_price']),
        ]);
    }

    public function store(Request $request, CreatePurchaseOrder $useCase)
    {
        $request->validate([
            'supplier_id'          => ['required', 'integer'],
            'warehouse_id'         => ['required', 'integer'],
            'date'                 => ['required', 'date'],
            'items'                => ['required', 'array', 'min:1'],
            'items.*.product_id'   => ['required', 'integer'],
            'items.*.quantity'     => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_cost'    => ['required', 'numeric', 'min:0'],
        ]);

        $order = $useCase->execute($request->all());

        return redirect()->route('purchase-orders.show', $order)
            ->with('success', "تم إنشاء أمر الشراء {$order->number} بنجاح");
    }

    public function show(PurchaseOrder $purchaseOrder): Response
    {
        return Inertia::render('Purchasing/Show', [
            'order' => $purchaseOrder->load(['supplier', 'warehouse', 'items.product']),
        ]);
    }

    public function confirm(PurchaseOrder $purchaseOrder)
    {
        if (! $purchaseOrder->canConfirm()) {
            return back()->with('error', 'لا يمكن تأكيد هذا الطلب');
        }

        $purchaseOrder->update(['status' => 'confirmed']);

        return back()->with('success', 'تم تأكيد أمر الشراء');
    }

    public function receive(PurchaseOrder $purchaseOrder, ReceiveGoods $useCase)
    {
        $useCase->execute($purchaseOrder->load('items'));

        return back()->with('success', 'تم استلام البضاعة وتحديث المخزون');
    }

    public function cancel(PurchaseOrder $purchaseOrder)
    {
        if (! $purchaseOrder->canCancel()) {
            return back()->with('error', 'لا يمكن إلغاء هذا الطلب');
        }

        $purchaseOrder->update(['status' => 'cancelled']);

        return back()->with('success', 'تم إلغاء أمر الشراء');
    }
}
