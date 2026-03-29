<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use App\Core\BaseModel;

class JournalLine extends BaseModel
{
    protected $fillable = ['entry_id', 'account_id', 'debit', 'credit', 'description'];

    protected $casts = ['debit' => 'decimal:2', 'credit' => 'decimal:2'];

    public function entry()
    {
        return $this->belongsTo(JournalEntry::class, 'entry_id');
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
