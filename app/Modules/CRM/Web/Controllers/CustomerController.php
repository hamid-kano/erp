<?php

namespace App\Modules\CRM\Web\Controllers;

use App\Core\AuditLog\AuditLog;
use App\Http\Controllers\Controller;
use App\Modules\CRM\Application\UseCases\CreateCustomer;
use App\Modules\CRM\Domain\DTOs\CreateCustomerDTO;
use App\Modules\CRM\Infrastructure\Models\Customer;
use App\Modules\CRM\Web\Requests\CustomerRequest;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        $customers = Customer::query()
            ->when(request('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when(request('active'), fn ($q) => $q->where('is_active', true))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('CRM/Customers/Index', [
            'customers' => $customers,
            'filters'   => request()->only('search', 'active'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('CRM/Customers/Form');
    }

    public function store(CustomerRequest $request, CreateCustomer $useCase)
    {
        $customer = $useCase->execute(new CreateCustomerDTO(...$request->validated()));

        return redirect()->route('customers.index')
            ->with('success', "تم إضافة العميل {$customer->name} بنجاح");
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('CRM/Customers/Form', ['customer' => $customer]);
    }

    public function update(CustomerRequest $request, Customer $customer)
    {
        $old = $customer->toArray();
        $customer->update($request->validated());
        AuditLog::record('updated', $customer, $old, $customer->toArray());

        return redirect()->route('customers.index')
            ->with('success', 'تم تحديث بيانات العميل بنجاح');
    }

    public function destroy(Customer $customer)
    {
        AuditLog::record('deleted', $customer, $customer->toArray(), []);
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'تم حذف العميل بنجاح');
    }
}
