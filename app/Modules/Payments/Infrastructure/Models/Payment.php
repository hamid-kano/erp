<?php

namespace App\Modules\Payments\Infrastructure\Models;

use App\Core\BaseModel;
use App\Core\Shared\Exceptions\DomainException;
use App\Modules\Currency\Infrastructure\Models\Currency;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends BaseModel
{
    protected $fillable = [
        'tenant_id', 'number', 'currency_id', 'exchange_rate',
        'amount', 'amount_base', 'method', 'direction', 'status',
        'date', 'reference', 'reference_type', 'reference_id',
        'notes', 'created_by',
    ];

    protected $casts = [
        'date'          => 'date',
        'amount'        => 'decimal:2',
        'amount_base'   => 'decimal:2',
        'exchange_rate' => 'decimal:8',
    ];

    public function currency(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function invoice(): MorphTo
    {
        return $this->morphTo('reference');
    }

    public function journalEntry(): MorphOne
    {
        return $this->morphOne(\App\Modules\Accounting\Infrastructure\Models\JournalEntry::class, 'source');
    }

    public function isPosted(): bool    { return $this->status === 'posted'; }
    public function isCancelled(): bool { return $this->status === 'cancelled'; }

    public function assertCanCancel(): void
    {
        if (!$this->isPosted()) {
            throw new DomainException("الدفعة [{$this->number}] لا يمكن إلغاؤها");
        }
    }
}
