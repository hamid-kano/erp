<?php

namespace App\Modules\Inventory\Infrastructure\Models;

use App\Core\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends BaseModel
{
    protected $table = 'products';

    protected $casts = [
        'cost_price'    => 'decimal:2',
        'sell_price'    => 'decimal:2',
        'reorder_point' => 'decimal:3',
        'is_active'     => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function costLayers(): HasMany
    {
        return $this->hasMany(CostLayer::class);
    }

    public function getStockAttribute(): float
    {
        return (float) $this->stockMovements()->sum('quantity');
    }
}
