<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;

class AccountTemplateItem extends Model
{
    protected $fillable = [
        'template_id', 'parent_id', 'code', 'name',
        'type', 'normal_balance', 'is_postable',
        '_lft', '_rgt', 'depth',
    ];

    protected $casts = ['is_postable' => 'boolean'];

    public function template()
    {
        return $this->belongsTo(AccountTemplate::class);
    }

    public function children()
    {
        return $this->hasMany(AccountTemplateItem::class, 'parent_id')->orderBy('code');
    }
}
