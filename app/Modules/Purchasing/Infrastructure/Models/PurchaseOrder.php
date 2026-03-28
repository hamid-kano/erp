<?php

namespace App\Modules\Purchasing\Infrastructure\Models;

use App\Core\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\CRM\Infrastructure\Models\Supplier;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;

class PurchaseOrder extends BaseModel
{
    protected $table = 'purchase_orders';

    protected $casts = [
        'date'  => 'date',
        'total' => 'decimal:2',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class, 'order_id');
    }

    public function canConfirm(): bool   { return $this->status === 'draft'; }
    public function canReceive(): bool   { return $this->status === 'confirmed'; }
    public function canCancel(): bool    { return in_array($this->status, ['draft', 'confirmed']); }
}
