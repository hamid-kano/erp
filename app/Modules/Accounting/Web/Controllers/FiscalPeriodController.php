<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Infrastructure\Models\FiscalPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FiscalPeriodController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', FiscalPeriod::class);

        $periods = FiscalPeriod::orderByDesc('start_date')->get();

        return Inertia::render('Accounting/FiscalPeriods/Index', ['periods' => $periods]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', FiscalPeriod::class);

        $data = $request->validate([
            'name'       => ['required', 'string', 'max:100'],
            'start_date' => ['required', 'date'],
            'end_date'   => ['required', 'date', 'after:start_date'],
        ]);

        // التحقق من عدم التداخل مع فترات أخرى
        $overlap = FiscalPeriod::where('tenant_id', auth()->user()->tenant_id)
            ->where('start_date', '<=', $data['end_date'])
            ->where('end_date', '>=', $data['start_date'])
            ->exists();

        if ($overlap) {
            return back()->withErrors(['start_date' => 'تتداخل مع فترة مالية موجودة']);
        }

        FiscalPeriod::create([
            ...$data,
            'tenant_id' => auth()->user()->tenant_id,
        ]);

        return redirect()->route('fiscal-periods.index')->with('success', 'تم إنشاء الفترة المالية');
    }

    public function close(FiscalPeriod $fiscalPeriod)
    {
        $this->authorize('close', $fiscalPeriod);

        $fiscalPeriod->close(auth()->id());

        return redirect()->route('fiscal-periods.index')->with('success', "تم إغلاق الفترة [{$fiscalPeriod->name}]");
    }
}
