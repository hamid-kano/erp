<?php

namespace App\Modules\Inventory\Infrastructure\Models;

use App\Core\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Kalnoy\Nestedset\NodeTrait;

class ItemGroup extends BaseModel
{
    use NodeTrait;

    protected $table = 'item_groups';

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'item_group_id');
    }
}
