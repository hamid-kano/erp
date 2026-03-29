<?php

namespace App\Modules\Payments\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Infrastructure\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::orderByDesc('date')
            ->when(request('direction'), fn($q, $d) => $q->where('direction', $d))
            ->paginate(20)->withQueryString();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'filters'  => request()->only('direction'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Payments/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'amount'      => ['required', 'numeric', 'min:0.01'],
            'currency_id' => ['nullable', 'exists:currencies,id'],
            'method'      => ['required', 'string'],
            'date'        => ['required', 'date'],
            'direction'   => ['required', 'in:in,out'],
            'notes'       => ['nullable', 'string'],
        ]);

        $baseCurrencyId = app(\App\Core\Tenancy\TenantManager::class)->getBaseCurrencyId();
        $currencyId     = $data['currency_id'] ?? $baseCurrencyId;
        $exchangeRate   = 1.0;

        if ($currencyId && $baseCurrencyId && $currencyId !== $baseCurrencyId) {
            $exchangeRate = app(\App\Modules\Currency\Domain\Services\CurrencyService::class)
                ->getRate($currencyId, $baseCurrencyId, $data['date']);
        }

        Payment::create(array_merge($data, [
            'currency_id'   => $currencyId,
            'exchange_rate' => $exchangeRate,
            'amount_base'   => round($data['amount'] * $exchangeRate, 2),
            'created_by'    => auth()->id(),
        ]));

        return redirect()->route('payments.index')->with('success', 'تم تسجيل الدفعة بنجاح');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return back()->with('success', 'تم حذف الدفعة');
    }
}
