<?php

namespace App\Modules\Inventory\Infrastructure\Models;

use App\Core\BaseModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockAdjustment extends BaseModel
{
    protected $table = 'stock_adjustments';

    protected $casts = [
        'quantity'    => 'decimal:3',
        'approved_at' => 'datetime',
    ];

    public function product(): BelongsTo   { return $this->belongsTo(Product::class); }
    public function warehouse(): BelongsTo { return $this->belongsTo(\App\Modules\Warehouse\Infrastructure\Models\Warehouse::class); }
    public function requestedBy(): BelongsTo { return $this->belongsTo(User::class, 'requested_by'); }
    public function approvedBy(): BelongsTo  { return $this->belongsTo(User::class, 'approved_by'); }
    public function movement(): BelongsTo    { return $this->belongsTo(StockMovement::class, 'movement_id'); }

    public function isPending(): bool  { return $this->status === 'pending'; }
    public function isApproved(): bool { return $this->status === 'approved'; }
}
