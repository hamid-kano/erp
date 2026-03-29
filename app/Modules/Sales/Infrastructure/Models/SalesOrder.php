<?php

namespace App\Modules\Sales\Infrastructure\Models;

use App\Core\BaseModel;
use App\Modules\CRM\Infrastructure\Models\Customer;
use App\Modules\Currency\Infrastructure\Models\Currency;
use App\Modules\Warehouse\Infrastructure\Models\Warehouse;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SalesOrder extends BaseModel
{
    protected $table = 'sales_orders';

    protected $casts = [
        'date'          => 'date',
        'total'         => 'decimal:2',
        'total_base'    => 'decimal:2',
        'exchange_rate' => 'decimal:8',
    ];

    public function customer(): BelongsTo  { return $this->belongsTo(Customer::class); }
    public function warehouse(): BelongsTo { return $this->belongsTo(Warehouse::class); }
    public function currency(): BelongsTo  { return $this->belongsTo(Currency::class); }
    public function items(): HasMany       { return $this->hasMany(SalesOrderItem::class, 'order_id'); }
    public function invoice(): HasOne      { return $this->hasOne(SalesInvoice::class, 'order_id'); }

    public function canConfirm(): bool { return $this->status === 'draft'; }
    public function canShip(): bool    { return $this->status === 'confirmed'; }
    public function canCancel(): bool  { return in_array($this->status, ['draft', 'confirmed']); }
}
