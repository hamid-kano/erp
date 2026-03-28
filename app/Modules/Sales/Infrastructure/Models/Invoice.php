<?php

namespace App\Modules\Sales\Infrastructure\Models;

use App\Core\BaseModel;
use App\Modules\CRM\Infrastructure\Models\Customer;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends BaseModel
{
    protected $table = 'invoices';

    protected $casts = [
        'date'     => 'date',
        'due_date' => 'date',
        'total'    => 'decimal:2',
        'paid'     => 'decimal:2',
    ];

    public function customer(): BelongsTo  { return $this->belongsTo(Customer::class); }
    public function order(): BelongsTo     { return $this->belongsTo(SalesOrder::class, 'order_id'); }

    public function getBalanceAttribute(): float
    {
        return (float) $this->total - (float) $this->paid;
    }
}
