<?php

namespace App\Modules\Sales\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Infrastructure\Models\Customer;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Sales\Application\UseCases\CreateSalesOrder;
use App\Modules\Sales\Application\UseCases\ShipOrder;
use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalesOrderController extends Controller
{
    public function index(): Response
    {
        $orders = SalesOrder::with(['customer', 'warehouse'])
            ->when(request('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Sales/Index', [
            'orders'  => $orders,
            'filters' => request()->only('status'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Sales/Form', [
            'customers'  => Customer::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'warehouses' => Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'products'   => Product::where('is_active', true)->orderBy('name')->get(['id', 'name', 'sku', 'sell_price']),
        ]);
    }

    public function store(Request $request, CreateSalesOrder $useCase)
    {
        $request->validate([
            'customer_id'          => ['required', 'integer'],
            'warehouse_id'         => ['required', 'integer'],
            'date'                 => ['required', 'date'],
            'items'                => ['required', 'array', 'min:1'],
            'items.*.product_id'   => ['required', 'integer'],
            'items.*.quantity'     => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_price'   => ['required', 'numeric', 'min:0'],
        ]);

        $order = $useCase->execute($request->all());

        return redirect()->route('sales-orders.show', $order)
            ->with('success', "تم إنشاء أمر البيع {$order->number} بنجاح");
    }

    public function show(SalesOrder $salesOrder): Response
    {
        return Inertia::render('Sales/Show', [
            'order' => $salesOrder->load(['customer', 'warehouse', 'items.product', 'invoice']),
        ]);
    }

    public function confirm(SalesOrder $salesOrder)
    {
        if (! $salesOrder->canConfirm()) {
            return back()->with('error', 'لا يمكن تأكيد هذا الطلب');
        }

        $salesOrder->update(['status' => 'confirmed']);

        return back()->with('success', 'تم تأكيد أمر البيع');
    }

    public function ship(SalesOrder $salesOrder, ShipOrder $useCase)
    {
        $useCase->execute($salesOrder->load('items.product'));

        return back()->with('success', 'تم شحن الطلب وإصدار الفاتورة');
    }

    public function cancel(SalesOrder $salesOrder)
    {
        if (! $salesOrder->canCancel()) {
            return back()->with('error', 'لا يمكن إلغاء هذا الطلب');
        }

        $salesOrder->update(['status' => 'cancelled']);

        return back()->with('success', 'تم إلغاء أمر البيع');
    }
}
