<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Application\UseCases\CreateChartOfAccountsFromTemplate;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\AccountTemplate;
use App\Modules\Accounting\Web\Requests\AccountRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Account::class);

        $accounts = Account::orderBy('_lft')
            ->get(['id', 'code', 'name', 'type', 'normal_balance', 'is_postable', 'is_locked', 'is_active', 'depth', 'parent_id'])
            ->keyBy('id')
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
                'parent_id'      => $a->parent_id,
            ])
            ->values();

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

    public function store(AccountRequest $request)
    {
        $this->authorize('create', Account::class);

        Account::create($request->validated());

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

    public function update(AccountRequest $request, Account $account)
    {
        $this->authorize('update', $account);

        $account->assertCanEdit();

        $account->update($request->validated());

        return redirect()->route('accounts.index')->with('success', 'تم تحديث الحساب بنجاح');
    }
}
