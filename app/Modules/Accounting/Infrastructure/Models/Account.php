<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use App\Core\BaseModel;
use App\Core\Shared\Exceptions\DomainException;
use Kalnoy\Nestedset\NodeTrait;

class Account extends BaseModel
{
    use NodeTrait;

    protected $fillable = [
        'tenant_id', 'template_item_id', 'parent_id',
        'code', 'name', 'type', 'normal_balance',
        'is_postable', 'is_locked', 'is_active',
    ];

    protected $casts = [
        'is_postable' => 'boolean',
        'is_locked'   => 'boolean',
        'is_active'   => 'boolean',
    ];

    // ── Domain Rules ──────────────────────────────────────

    public function assertCanPost(): void
    {
        if (!$this->is_postable) {
            throw new DomainException("الحساب [{$this->code}] تجميعي ولا يقبل قيوداً");
        }

        if ($this->is_locked) {
            throw new DomainException("الحساب [{$this->code}] مقفل ولا يمكن التعديل عليه");
        }

        if (!$this->is_active) {
            throw new DomainException("الحساب [{$this->code}] غير نشط");
        }
    }

    /**
     * الرصيد الموقّع حسب الاتجاه الطبيعي للحساب
     */
    public function getSignedBalance(float $debit, float $credit): float
    {
        $balance = $debit - $credit;
        return $this->normal_balance === 'debit' ? $balance : -$balance;
    }

    public function lock(): void
    {
        $this->update(['is_locked' => true]);
    }

    public function hasJournalLines(): bool
    {
        return JournalLine::where('account_id', $this->id)->exists();
    }

    // ── Relationships ─────────────────────────────────────

    public function journalLines()
    {
        return $this->hasMany(JournalLine::class);
    }

    // ── Balance ───────────────────────────────────────────

    /**
     * رصيد الحساب من القيود المرحّلة
     */
    public function getBalance(string $from = null, string $to = null): float
    {
        $query = $this->journalLines()
            ->whereHas('entry', fn($q) => $q->where('status', 'posted')
                ->when($from, fn($q) => $q->where('date', '>=', $from))
                ->when($to,   fn($q) => $q->where('date', '<=', $to))
            );

        $debit  = (float) $query->sum('debit');
        $credit = (float) $query->sum('credit');

        return $this->getSignedBalance($debit, $credit);
    }

    /**
     * رصيد الحساب وكل أبنائه (للحسابات التجميعية)
     */
    public function getTreeBalance(string $from = null, string $to = null): float
    {
        $accountIds = $this->descendants()->pluck('id')->push($this->id);

        $query = JournalLine::whereIn('account_id', $accountIds)
            ->whereHas('entry', fn($q) => $q->where('status', 'posted')
                ->when($from, fn($q) => $q->where('date', '>=', $from))
                ->when($to,   fn($q) => $q->where('date', '<=', $to))
            );

        $debit  = (float) $query->sum('debit');
        $credit = (float) $query->sum('credit');

        return $this->getSignedBalance($debit, $credit);
    }

    // ── Scopes ────────────────────────────────────────────

    public function scopePostable($query)
    {
        return $query->where('is_postable', true)->where('is_active', true);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
