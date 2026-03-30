<?php

namespace App\Modules\Accounting\Web\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JournalEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled in controller via Policy
    }

    public function rules(): array
    {
        return [
            'date'               => ['required', 'date'],
            'description'        => ['required', 'string'],
            'reference'          => ['nullable', 'string', 'max:100'],
            'currency_id'        => ['nullable', 'exists:currencies,id'],
            'lines'              => ['required', 'array', 'min:2'],
            'lines.*.account_id' => ['required', 'exists:accounts,id'],
            'lines.*.debit'      => ['required', 'numeric', 'min:0'],
            'lines.*.credit'     => ['required', 'numeric', 'min:0'],
            'lines.*.description'=> ['nullable', 'string', 'max:255'],
        ];
    }
}
