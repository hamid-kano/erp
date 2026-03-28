<?php

namespace App\Modules\CRM\Web\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:255'],
            'phone'        => ['nullable', 'string', 'max:20'],
            'email'        => ['nullable', 'email', 'max:255'],
            'address'      => ['nullable', 'string'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
