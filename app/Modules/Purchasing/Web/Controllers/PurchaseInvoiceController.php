<?php

namespace App\Modules\Purchasing\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Infrastructure\Models\Supplier;
use App\Modules\Currency\Infrastructure\Models\Currency;
use App\Modules\Inventory\Infrastructure\Models\Product;
use App\Modules\Purchasing\Application\UseCases\CreatePurchaseInvoice;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseInvoice;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseInvoiceController extends Controller
{
    public function index()
    {
        $invoices = PurchaseInvoice::with(['supplier', 'currency'])
            ->when(request('status'), fn($q, $s) => $q->where('status', $s))
            ->when(request('supplier_id'), fn($q, $s) => $q->where('supplier_id', $s))
            ->orderByDesc('date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Purchasing/Invoices/Index', [
            'invoices'  => $invoices,
            'filters'   => request()->only('status', 'supplier_id'),
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create()
    {
        $orderId = request('order_id');
        $order   = $orderId ? PurchaseOrder::with('items.product', 'supplier')->find($orderId) : null;

        return Inertia::render('Purchasing/Invoices/Form', [
            'order'      => $order,
            'suppliers'  => Supplier::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'warehouses' => Warehouse::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'products'   => Product::active()->orderBy('name')->get(['id', 'name', 'sku', 'cost_price']),
            'currencies' => Currency::active()->orderBy('code')->get(['id', 'code', 'name', 'symbol']),
        ]);
    }

    public function store(Request $request, CreatePurchaseInvoice $useCase)
    {
        $request->validate([
            'supplier_id'             => ['required', 'exists:suppliers,id'],
            'warehouse_id'            => ['required', 'exists:warehouses,id'],
            'date'                    => ['required', 'date'],
            'due_date'                => ['nullable', 'date', 'after_or_equal:date'],
            'currency_id'             => ['nullable', 'exists:currencies,id'],
            'supplier_invoice_number' => ['nullable', 'string', 'max:100'],
            'items'                   => ['required', 'array', 'min:1'],
            'items.*.product_id'      => ['required', 'exists:products,id'],
            'items.*.quantity'        => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_cost'       => ['required', 'numeric', 'min:0'],
        ]);

        $invoice = $useCase->execute($request->all());

        return redirect()->route('purchase-invoices.show', $invoice)
            ->with('success', "تم إنشاء فاتورة الشراء {$invoice->number} بنجاح");
    }

    public function show(PurchaseInvoice $purchaseInvoice)
    {
        return Inertia::render('Purchasing/Invoices/Show', [
            'invoice' => $purchaseInvoice->load(['supplier', 'currency', 'items.product', 'order']),
        ]);
    }
}
