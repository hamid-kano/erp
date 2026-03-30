<?php

namespace App\Modules\Sales\Infrastructure\Models;

use App\Core\BaseModel;
use App\Modules\CRM\Infrastructure\Models\Customer;
use App\Modules\Currency\Infrastructure\Models\Currency;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesInvoice extends BaseModel
{
    use SoftDeletes;

    protected $table = 'sales_invoices';

    protected $casts = [
        'date'          => 'date',
        'due_date'      => 'date',
        'total'         => 'decimal:2',
        'total_base'    => 'decimal:2',
        'cogs'          => 'decimal:2',
        'paid'          => 'decimal:2',
        'exchange_rate' => 'decimal:8',
    ];

    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function order(): BelongsTo    { return $this->belongsTo(SalesOrder::class, 'order_id'); }
    public function currency(): BelongsTo { return $this->belongsTo(Currency::class); }
    public function items(): HasMany      { return $this->hasMany(SalesInvoiceItem::class); }
    public function journalEntry(): MorphOne
    {
        return $this->morphOne(\App\Modules\Accounting\Infrastructure\Models\JournalEntry::class, 'source');
    }

    public function getBalanceAttribute(): float
    {
        return (float)$this->total - (float)$this->paid;
    }

    public function getBalanceBaseAttribute(): float
    {
        return (float)$this->total_base - round((float)$this->paid * (float)$this->exchange_rate, 2);
    }

    public function canCancel(): bool { return in_array($this->status, ['issued', 'partial']); }
    public function isPaid(): bool    { return $this->status === 'paid'; }
}
