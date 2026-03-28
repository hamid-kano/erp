<?php

namespace App\Modules\Inventory\Web\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockMovementRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'product_id'   => ['required', 'integer', 'exists:products,id'],
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'quantity'     => ['required', 'numeric', 'min:0.001'],
            'unit_cost'    => ['nullable', 'numeric', 'min:0'],
            'type'         => ['required', 'in:in,out,adjustment'],
        ];
    }
}
