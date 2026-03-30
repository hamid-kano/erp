<?php

namespace App\Modules\Analytics\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Infrastructure\Models\Customer;
use App\Modules\CRM\Infrastructure\Models\Supplier;
use App\Modules\Inventory\Infrastructure\Models\Item;
use App\Modules\Payments\Infrastructure\Models\Payment;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseOrder;
use App\Modules\Sales\Infrastructure\Models\SalesInvoice;
use App\Modules\Sales\Infrastructure\Models\SalesOrder;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'customers'       => Customer::count(),
            'suppliers'       => Supplier::count(),
            'items'           => Item::where('is_active', true)->count(),
            'warehouses'      => Warehouse::where('is_active', true)->count(),
            'sales_orders'    => SalesOrder::count(),
            'purchase_orders' => PurchaseOrder::count(),
            'revenue'         => SalesInvoice::where('status', 'paid')->sum('total'),
            'pending_invoices' => SalesInvoice::where('status', 'unpaid')->count(),
            'payments_in'     => Payment::where('direction', 'in')->sum('amount'),
            'payments_out'    => Payment::where('direction', 'out')->sum('amount'),
        ];

        $recentSales = SalesOrder::with('customer')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'number', 'customer_id', 'total', 'status', 'date']);

        $recentPurchases = PurchaseOrder::with('supplier')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'number', 'supplier_id', 'total', 'status', 'date']);

        return Inertia::render('Analytics/Dashboard/Index', compact('stats', 'recentSales', 'recentPurchases'));
    }
}
