<?php

namespace App\Modules\CRM\Web\Controllers;

use App\Core\AuditLog\AuditLog;
use App\Http\Controllers\Controller;
use App\Modules\CRM\Application\UseCases\CreateSupplier;
use App\Modules\CRM\Domain\DTOs\CreateSupplierDTO;
use App\Modules\CRM\Infrastructure\Models\Supplier;
use App\Modules\CRM\Web\Requests\SupplierRequest;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(): Response
    {
        $suppliers = Supplier::query()
            ->when(request('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('CRM/Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters'   => request()->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('CRM/Suppliers/Form');
    }

    public function store(SupplierRequest $request, CreateSupplier $useCase)
    {
        $supplier = $useCase->execute(new CreateSupplierDTO(...$request->validated()));

        return redirect()->route('suppliers.index')
            ->with('success', "تم إضافة المورد {$supplier->name} بنجاح");
    }

    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('CRM/Suppliers/Form', ['supplier' => $supplier]);
    }

    public function update(SupplierRequest $request, Supplier $supplier)
    {
        $old = $supplier->toArray();
        $supplier->update($request->validated());
        AuditLog::record('updated', $supplier, $old, $supplier->toArray());

        return redirect()->route('suppliers.index')
            ->with('success', 'تم تحديث بيانات المورد بنجاح');
    }

    public function destroy(Supplier $supplier)
    {
        AuditLog::record('deleted', $supplier, $supplier->toArray(), []);
        $supplier->delete();

        return redirect()->route('suppliers.index')
            ->with('success', 'تم حذف المورد بنجاح');
    }
}
