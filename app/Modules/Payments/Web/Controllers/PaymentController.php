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
            'amount'    => ['required', 'numeric', 'min:0.01'],
            'method'    => ['required', 'string'],
            'date'      => ['required', 'date'],
            'direction' => ['required', 'in:in,out'],
            'notes'     => ['nullable', 'string'],
        ]);

        Payment::create($data);

        return redirect()->route('payments.index')->with('success', 'تم تسجيل الدفعة بنجاح');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return back()->with('success', 'تم حذف الدفعة');
    }
}
