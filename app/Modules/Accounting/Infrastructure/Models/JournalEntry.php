<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use App\Core\BaseModel;
use App\Core\Shared\Exceptions\DomainException;

class JournalEntry extends BaseModel
{
    protected $fillable = [
        'tenant_id', 'date', 'description',
        'reference', 'status', 'posted_at', 'created_by',
    ];

    protected $casts = [
        'date'      => 'date',
        'posted_at' => 'datetime',
    ];

    public function lines()
    {
        return $this->hasMany(JournalLine::class, 'entry_id');
    }

    public function isPosted(): bool
    {
        return $this->status === 'posted';
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

    // ── Scopes ────────────────────────────────────────────

    public function scopePosted($query)
    {
        return $query->where('status', 'posted');
    }

    public function scopeForPeriod($query, string $from, string $to)
    {
        return $query->whereBetween('date', [$from, $to]);
    }
}
