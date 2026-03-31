<?php

namespace App\Modules\Accounting\Web\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Core\Tenancy\TenantManager;

class AccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled in controller via Policy
    }

    public function rules(): array
    {
        $tenantId  = app(TenantManager::class)->getId();
        $accountId = $this->route('account')?->id;

        return [
            'code' => [
                'required', 'string', 'max:20',
                \Illuminate\Validation\Rule::unique('accounts', 'code')
                    ->where('tenant_id', $tenantId)
                    ->ignore($accountId),
            ],
            'name'                 => ['required', 'string', 'max:255'],
            'type'                 => ['required', 'in:asset,liability,equity,revenue,expense'],
            'normal_balance'       => ['required', 'in:debit,credit'],
            'parent_id'            => ['nullable', 'exists:accounts,id'],
            'currency_id'          => ['nullable', 'exists:currencies,id'],
            'is_postable'          => ['boolean'],
            'opening_balance'      => ['nullable', 'numeric'],
            'opening_balance_date' => ['nullable', 'date'],
        ];
    }
}
