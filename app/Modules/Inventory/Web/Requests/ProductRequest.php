<?php

namespace App\Modules\Inventory\Web\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'sku'           => ['nullable', 'string', 'max:100'],
            'category_id'   => ['nullable', 'integer', 'exists:categories,id'],
            'unit_id'       => ['nullable', 'integer', 'exists:units,id'],
            'cost_price'    => ['nullable', 'numeric', 'min:0'],
            'sell_price'    => ['nullable', 'numeric', 'min:0'],
            'reorder_point' => ['nullable', 'numeric', 'min:0'],
            'cost_method'   => ['nullable', 'in:fifo,weighted'],
        ];
    }
}
