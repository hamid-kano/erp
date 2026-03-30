<?php

namespace App\Modules\Purchasing\Infrastructure\Models;

use App\Core\BaseModel;
use App\Modules\CRM\Infrastructure\Models\Supplier;
use App\Modules\Currency\Infrastructure\Models\Currency;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class PurchaseInvoice extends BaseModel
{
    protected $table = 'purchase_invoices';

    protected $casts = [
        'date'          => 'date',
        'due_date'      => 'date',
        'total'         => 'decimal:2',
        'total_base'    => 'decimal:2',
        'paid'          => 'decimal:2',
        'exchange_rate' => 'decimal:8',
    ];

    public function supplier()  { return $this->belongsTo(Supplier::class); }
    public function order()     { return $this->belongsTo(PurchaseOrder::class, 'order_id'); }
    public function currency()  { return $this->belongsTo(Currency::class); }
    public function items()     { return $this->hasMany(PurchaseInvoiceItem::class, 'invoice_id'); }
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

    public function canPost(): bool   { return $this->status === 'draft'; }
    public function canCancel(): bool { return $this->status === 'draft'; }
    public function isPaid(): bool    { return $this->status === 'paid'; }
}
