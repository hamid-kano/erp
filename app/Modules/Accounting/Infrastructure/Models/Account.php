<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use App\Core\BaseModel;

class Account extends BaseModel
{
    protected $fillable = ['tenant_id', 'code', 'name', 'type', 'parent_id', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function parent()
    {
        return $this->belongsTo(Account::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function journalLines()
    {
        return $this->hasMany(JournalLine::class);
    }
}
