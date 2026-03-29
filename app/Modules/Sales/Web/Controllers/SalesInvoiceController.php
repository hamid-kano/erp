<?php

namespace App\Modules\Sales\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Infrastructure\Models\Customer;
use App\Modules\Currency\Infrastructure\Models\Currency;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Sales\Application\UseCases\CreateSalesInvoice;
use App\Modules\Sales\Infrastructure\Models\SalesInvoice;
use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesInvoiceController extends Controller
{
    public function index()
    {
        $invoices = SalesInvoice::with(['customer', 'currency'])
            ->when(request('status'),      fn($q, $s) => $q->where('status', $s))
            ->when(request('customer_id'), fn($q, $s) => $q->where('customer_id', $s))
            ->orderByDesc('date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Sales/Invoices/Index', [
            'invoices'  => $invoices,
            'filters'   => request()->only('status', 'customer_id'),
            'customers' => Customer::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        $orderId = request('order_id');
        $order   = $orderId ? SalesOrder::with('items.product', 'customer')->find($orderId) : null;

        return Inertia::render('Sales/Invoices/Form', [
            'order'      => $order,
            'customers'  => Customer::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'warehouses' => Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'products'   => Product::active()->orderBy('name')->get(['id', 'name', 'sku', 'sell_price']),
            'currencies' => Currency::active()->orderBy('code')->get(['id', 'code', 'name', 'symbol']),
        ]);
    }

    public function store(Request $request, CreateSalesInvoice $useCase)
    {
        $request->validate([
            'customer_id'        => ['required', 'exists:customers,id'],
            'warehouse_id'       => ['required', 'exists:warehouses,id'],
            'date'               => ['required', 'date'],
            'due_date'           => ['nullable', 'date', 'after_or_equal:date'],
            'currency_id'        => ['nullable', 'exists:currencies,id'],
            'items'              => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity'   => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $invoice = $useCase->execute($request->all());

        return redirect()->route('sales-invoices.show', $invoice)
            ->with('success', "تم إنشاء الفاتورة {$invoice->number} بنجاح");
    }

    public function show(SalesInvoice $salesInvoice)
    {
        return Inertia::render('Sales/Invoices/Show', [
            'invoice' => $salesInvoice->load(['customer', 'currency', 'items.product', 'order']),
        ]);
    }
}
