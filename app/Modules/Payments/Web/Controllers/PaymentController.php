<?php

namespace App\Modules\Payments\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Core\Tenancy\TenantManager;
use App\Modules\Payments\Application\UseCases\ProcessPayment;
use App\Modules\Payments\Infrastructure\Models\Payment;
use App\Modules\Sales\Infrastructure\Models\SalesInvoice;
use App\Modules\Purchasing\Infrastructure\Models\PurchaseInvoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        private ProcessPayment  $processPayment,
        private TenantManager   $tenantManager,
    ) {}

    public function index()
    {
        $payments = Payment::with('currency')
            ->where('status', 'posted')
            ->orderByDesc('date')
            ->when(request('direction'), fn($q, $d) => $q->where('direction', $d))
            ->paginate(20)->withQueryString();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'filters'  => request()->only('direction'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount'       => ['required', 'numeric', 'min:0.01'],
            'method'       => ['required', 'in:cash,bank,cheque,other'],
            'direction'    => ['required', 'in:in,out'],
            'date'         => ['required', 'date'],
            'currency_id'  => ['nullable', 'exists:currencies,id'],
            'invoice_type' => ['nullable', 'in:sales,purchase'],
            'invoice_id'   => ['nullable', 'integer'],
            'notes'        => ['nullable', 'string', 'max:500'],
        ]);

        $payment = $this->processPayment->execute($request->all());

        return redirect()->route('payments.index')
            ->with('success', "تم تسجيل الدفعة {$payment->number} بنجاح");
    }

    public function cancel(Payment $payment)
    {
        $this->processPayment->cancel($payment);

        return back()->with('success', "تم إلغاء الدفعة {$payment->number}");
    }

    // جلب فواتير غير مدفوعة بالكامل للربط
    public function pendingInvoices(Request $request)
    {
        $type      = $request->query('type', 'sales');
        $tenantId  = $this->tenantManager->getId();

        $invoices = $type === 'sales'
            ? SalesInvoice::where('tenant_id', $tenantId)
                ->whereIn('status', ['issued', 'partial'])
                ->orderByDesc('date')
                ->get(['id', 'number', 'total', 'paid', 'date'])
            : PurchaseInvoice::where('tenant_id', $tenantId)
                ->whereIn('status', ['posted', 'partial'])
                ->orderByDesc('date')
                ->get(['id', 'number', 'total', 'paid', 'date']);

        return response()->json($invoices);
    }
}
