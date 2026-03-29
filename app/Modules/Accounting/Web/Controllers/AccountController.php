<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Infrastructure\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::with('parent')
            ->orderBy('code')
            ->paginate(50);

        return Inertia::render('Accounting/Accounts/Index', ['accounts' => $accounts]);
    }

    public function create()
    {
        return Inertia::render('Accounting/Accounts/Form', [
            'parents' => Account::orderBy('code')->get(['id', 'code', 'name']),
            'types'   => ['asset', 'liability', 'equity', 'revenue', 'expense'],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'      => ['required', 'string', 'max:20'],
            'name'      => ['required', 'string', 'max:255'],
            'type'      => ['required', 'in:asset,liability,equity,revenue,expense'],
            'parent_id' => ['nullable', 'exists:accounts,id'],
        ]);

        Account::create($data);

        return redirect()->route('accounts.index')->with('success', 'تم إضافة الحساب بنجاح');
    }

    public function edit(Account $account)
    {
        return Inertia::render('Accounting/Accounts/Form', [
            'account' => $account,
            'parents' => Account::where('id', '!=', $account->id)->orderBy('code')->get(['id', 'code', 'name']),
            'types'   => ['asset', 'liability', 'equity', 'revenue', 'expense'],
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $data = $request->validate([
            'code'      => ['required', 'string', 'max:20'],
            'name'      => ['required', 'string', 'max:255'],
            'type'      => ['required', 'in:asset,liability,equity,revenue,expense'],
            'parent_id' => ['nullable', 'exists:accounts,id'],
        ]);

        $account->update($data);

        return redirect()->route('accounts.index')->with('success', 'تم تحديث الحساب بنجاح');
    }
}
