<?php

namespace App\Modules\Warehouse\Web\Controllers;

use App\Core\AuditLog\AuditLog;
use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function index(): Response
    {
        $warehouses = Warehouse::withCount('locations')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('Warehouse/Index', ['warehouses' => $warehouses]);
    }

    public function create(): Response
    {
        return Inertia::render('Warehouse/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
        ]);

        $warehouse = Warehouse::create($data);
        AuditLog::record('created', $warehouse, [], $warehouse->toArray());

        return redirect()->route('warehouses.index')
            ->with('success', "تم إضافة المستودع {$warehouse->name} بنجاح");
    }

    public function edit(Warehouse $warehouse): Response
    {
        return Inertia::render('Warehouse/Form', ['warehouse' => $warehouse]);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
        ]);

        $old = $warehouse->toArray();
        $warehouse->update($data);
        AuditLog::record('updated', $warehouse, $old, $warehouse->toArray());

        return redirect()->route('warehouses.index')
            ->with('success', 'تم تحديث المستودع بنجاح');
    }

    public function destroy(Warehouse $warehouse)
    {
        AuditLog::record('deleted', $warehouse, $warehouse->toArray(), []);
        $warehouse->delete();

        return redirect()->route('warehouses.index')
            ->with('success', 'تم حذف المستودع بنجاح');
    }
}
