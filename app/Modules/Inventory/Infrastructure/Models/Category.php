<?php

namespace App\Modules\Inventory\Infrastructure\Models;

use App\Core\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends BaseModel
{
    protected $table = 'categories';

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
