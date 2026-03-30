<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Application\UseCases\CreateChartOfAccountsFromTemplate;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\AccountTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Account::class);

        $accounts = Account::with('parent')
            ->orderBy('_lft')
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'code'           => $a->code,
                'name'           => $a->name,
                'type'           => $a->type,
                'normal_balance' => $a->normal_balance,
                'is_postable'    => $a->is_postable,
                'is_locked'      => $a->is_locked,
                'is_active'      => $a->is_active,
                'depth'          => $a->depth,
                'parent_code'    => $a->parent?->code,
            ]);

        $hasAccounts  = $accounts->isNotEmpty();
        $templates    = $hasAccounts ? [] : AccountTemplate::all(['id', 'name', 'description']);

        return Inertia::render('Accounting/Accounts/Index', compact('accounts', 'hasAccounts', 'templates'));
    }

    public function setupFromTemplate(Request $request, CreateChartOfAccountsFromTemplate $useCase)
    {
        $this->authorize('setupTemplate', Account::class);

        $request->validate(['template_id' => ['required', 'exists:account_templates,id']]);

        $tenant = auth()->user()->tenant;
        $useCase->execute($tenant, $request->template_id);

        return redirect()->route('accounts.index')->with('success', 'تم إنشاء شجرة الحسابات بنجاح');
    }

    public function create()
    {
        $this->authorize('create', Account::class);

        return Inertia::render('Accounting/Accounts/Form', [
            'parents'    => Account::postable()->orderBy('_lft')->get(['id', 'code', 'name']),
            'types'      => ['asset', 'liability', 'equity', 'revenue', 'expense'],
            'currencies' => \App\Modules\Currency\Infrastructure\Models\Currency::active()
                                ->orderBy('code')->get(['id', 'code', 'name', 'symbol']),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Account::class);

        $data = $request->validate([
            'code'                 => ['required', 'string', 'max:20'],
            'name'                 => ['required', 'string', 'max:255'],
            'type'                 => ['required', 'in:asset,liability,equity,revenue,expense'],
            'normal_balance'       => ['required', 'in:debit,credit'],
            'parent_id'            => ['nullable', 'exists:accounts,id'],
            'currency_id'          => ['nullable', 'exists:currencies,id'],
            'is_postable'          => ['boolean'],
            'opening_balance'      => ['nullable', 'numeric'],
            'opening_balance_date' => ['nullable', 'date'],
        ]);

        Account::create($data);

        return redirect()->route('accounts.index')->with('success', 'تم إضافة الحساب بنجاح');
    }

    public function edit(Account $account)
    {
        $this->authorize('update', $account);

        return Inertia::render('Accounting/Accounts/Form', [
            'account'    => $account,
            'parents'    => Account::where('id', '!=', $account->id)->orderBy('_lft')->get(['id', 'code', 'name']),
            'types'      => ['asset', 'liability', 'equity', 'revenue', 'expense'],
            'currencies' => \App\Modules\Currency\Infrastructure\Models\Currency::active()
                                ->orderBy('code')->get(['id', 'code', 'name', 'symbol']),
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $this->authorize('update', $account);

        $account->assertCanEdit();

        $data = $request->validate([
            'code'                 => ['required', 'string', 'max:20'],
            'name'                 => ['required', 'string', 'max:255'],
            'type'                 => ['required', 'in:asset,liability,equity,revenue,expense'],
            'normal_balance'       => ['required', 'in:debit,credit'],
            'parent_id'            => ['nullable', 'exists:accounts,id'],
            'currency_id'          => ['nullable', 'exists:currencies,id'],
            'is_postable'          => ['boolean'],
            'opening_balance'      => ['nullable', 'numeric'],
            'opening_balance_date' => ['nullable', 'date'],
        ]);

        $account->update($data);

        return redirect()->route('accounts.index')->with('success', 'تم تحديث الحساب بنجاح');
    }
}
