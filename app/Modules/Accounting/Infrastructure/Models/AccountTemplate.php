<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;

class AccountTemplate extends Model
{
    protected $fillable = ['name', 'description'];

    public function items()
    {
        return $this->hasMany(AccountTemplateItem::class, 'template_id')->orderBy('_lft');
    }
}
