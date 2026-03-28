<?php

namespace App\Modules\CRM\Web\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'phone'         => ['nullable', 'string', 'max:20'],
            'email'         => ['nullable', 'email', 'max:255'],
            'address'       => ['nullable', 'string'],
            'payment_terms' => ['nullable', 'integer', 'min:0', 'max:365'],
        ];
    }
}
