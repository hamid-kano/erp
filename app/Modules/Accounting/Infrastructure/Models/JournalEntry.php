<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use App\Core\BaseModel;
use App\Core\Shared\Exceptions\DomainException;
use App\Modules\Currency\Infrastructure\Models\Currency;

class JournalEntry extends BaseModel
{
    protected $fillable = [
        'tenant_id', 'number', 'currency_id', 'exchange_rate',
        'date', 'description', 'reference',
        'source_type', 'source_id',
        'status', 'posted_at', 'created_by', 'updated_by',
        'reversed_by', 'reversed_entry_id',
    ];

    protected $casts = [
        'date'          => 'date',
        'posted_at'     => 'datetime',
        'exchange_rate' => 'decimal:8',
    ];

    public function lines()
    {
        return $this->hasMany(JournalLine::class, 'entry_id');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function reversedEntry()
    {
        return $this->belongsTo(JournalEntry::class, 'reversed_entry_id');
    }

    public function isPosted(): bool
    {
        return $this->status === 'posted';
    }

    public function isReversed(): bool
    {
        return $this->status === 'reversed';
    }

    public function isBalanced(): bool
    {
        $debit  = $this->lines->sum('debit');
        $credit = $this->lines->sum('credit');
        return round((float)$debit, 2) === round((float)$credit, 2);
    }

    public function assertCanReverse(): void
    {
        if (!$this->isPosted()) {
            throw new DomainException('لا يمكن عكس قيد غير مرحّل');
        }
    }

    public function scopePosted($query)
    {
        return $query->where('status', 'posted');
    }

    public function scopeForPeriod($query, string $from, string $to)
    {
        return $query->whereBetween('date', [$from, $to]);
    }
}
