<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Infrastructure\Models\FiscalPeriod;
use App\Modules\Accounting\Web\Requests\FiscalPeriodRequest;
use Inertia\Inertia;

class FiscalPeriodController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', FiscalPeriod::class);

        $periods = FiscalPeriod::orderByDesc('start_date')->get();

        return Inertia::render('Accounting/FiscalPeriods/Index', ['periods' => $periods]);
    }

    public function store(FiscalPeriodRequest $request)
    {
        $this->authorize('create', FiscalPeriod::class);

        $data     = $request->validated();
        $tenantId = auth()->user()->tenant_id;

        if (FiscalPeriod::hasOverlap($tenantId, $data['start_date'], $data['end_date'])) {
            return back()->withErrors(['start_date' => 'تتداخل مع فترة مالية موجودة']);
        }

        FiscalPeriod::create([...$data, 'tenant_id' => $tenantId]);

        return redirect()->route('fiscal-periods.index')->with('success', 'تم إنشاء الفترة المالية');
    }

    public function close(FiscalPeriod $fiscalPeriod)
    {
        $this->authorize('close', $fiscalPeriod);

        $fiscalPeriod->close(auth()->id());

        return redirect()->route('fiscal-periods.index')->with('success', "تم إغلاق الفترة [{$fiscalPeriod->name}]");
    }
}
