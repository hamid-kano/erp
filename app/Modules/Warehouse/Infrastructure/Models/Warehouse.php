<?php

namespace App\Modules\Warehouse\Infrastructure\Models;

use App\Core\BaseModel;

class Warehouse extends BaseModel
{
    protected $table = 'warehouses';

    protected $casts = ['is_active' => 'boolean'];
}
