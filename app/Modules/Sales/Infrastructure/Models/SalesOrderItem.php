<?php

namespace App\Modules\Sales\Infrastructure\Models;

use App\Modules\Inventory\Infrastructure\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesOrderItem extends Model
{
    protected $table = 'sales_order_items';
    protected $guarded = ['id'];

    protected $casts = [
        'quantity'   => 'decimal:3',
        'unit_price' => 'decimal:2',
        'total'      => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
