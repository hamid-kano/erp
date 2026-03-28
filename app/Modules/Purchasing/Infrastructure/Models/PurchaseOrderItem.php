<?php

namespace App\Modules\Purchasing\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Inventory\Infrastructure\Models\Product;

class PurchaseOrderItem extends Model
{
    protected $table = 'purchase_order_items';
    protected $guarded = ['id'];

    protected $casts = [
        'quantity'  => 'decimal:3',
        'unit_cost' => 'decimal:2',
        'total'     => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
