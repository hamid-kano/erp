<?php

namespace App\Modules\Purchasing\Infrastructure\Models;

use App\Core\BaseModel;
use App\Modules\CRM\Infrastructure\Models\Supplier;
use App\Modules\Currency\Infrastructure\Models\Currency;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class PurchaseOrder extends BaseModel
{
    protected $table = 'purchase_orders';

    protected $casts = [
        'date'          => 'date',
        'total'         => 'decimal:2',
        'total_base'    => 'decimal:2',
        'exchange_rate' => 'decimal:8',
    ];

    public function supplier(): BelongsTo  { return $this->belongsTo(Supplier::class); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
    public function currency(): BelongsTo  { return $this->belongsTo(Currency::class); }
    public function items(): HasMany       { return $this->hasMany(PurchaseOrderItem::class, 'order_id'); }
    public function invoice()              { return $this->hasOne(PurchaseInvoice::class, 'order_id'); }
    public function journalEntry(): MorphOne
    {
        return $this->morphOne(\App\Modules\Accounting\Infrastructure\Models\JournalEntry::class, 'source');
    }

    public function canConfirm(): bool { return $this->status === 'draft'; }
    public function canReceive(): bool { return $this->status === 'confirmed'; }
    public function canCancel(): bool  { return in_array($this->status, ['draft', 'confirmed']); }
}
