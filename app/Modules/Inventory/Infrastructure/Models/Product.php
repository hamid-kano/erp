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

    // ── Relationships ─────────────────────────────────────

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

    public function reservations(): HasMany
    {
        return $this->hasMany(StockReservation::class);
    }

    // ── Stock Helpers ─────────────────────────────────────

    /**
     * استخدم withSum('stockMovements', 'quantity') في الـ queries
     * بدل هذا الـ accessor لتجنب N+1
     */
    public function getStockAttribute(): float
    {
        // لو تم تحميله عبر withSum نستخدمه مباشرة
        if (isset($this->attributes['stock_movements_sum_quantity'])) {
            return (float) $this->attributes['stock_movements_sum_quantity'];
        }

        return (float) $this->stockMovements()->sum('quantity');
    }

    public function getReservedAttribute(): float
    {
        if (isset($this->attributes['reservations_sum_quantity'])) {
            return (float) $this->attributes['reservations_sum_quantity'];
        }

        return (float) $this->reservations()->where('status', 'reserved')->sum('quantity');
    }

    public function getAvailableStockAttribute(): float
    {
        return max(0, $this->stock - $this->reserved);
    }

    public function isLowStock(): bool
    {
        return $this->reorder_point > 0 && $this->stock <= $this->reorder_point;
    }

    // ── Scopes ────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithStock($query)
    {
        return $query->withSum('stockMovements', 'quantity');
    }

    public function scopeWithReserved($query)
    {
        return $query->withSum(['reservations' => fn($q) => $q->where('status', 'reserved')], 'quantity');
    }
}
