<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use App\Core\BaseModel;

class JournalEntry extends BaseModel
{
    protected $fillable = ['tenant_id', 'date', 'description', 'reference', 'posted_at'];

    protected $casts = ['date' => 'date', 'posted_at' => 'datetime'];

    public function lines()
    {
        return $this->hasMany(JournalLine::class, 'entry_id');
    }

    public function isPosted(): bool
    {
        return !is_null($this->posted_at);
    }

    public function isBalanced(): bool
    {
        $debit  = $this->lines->sum('debit');
        $credit = $this->lines->sum('credit');
        return round($debit, 2) === round($credit, 2);
    }
}
