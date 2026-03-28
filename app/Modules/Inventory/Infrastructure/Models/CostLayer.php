<?php

namespace App\Modules\Inventory\Infrastructure\Models;

use App\Core\BaseModel;

class CostLayer extends BaseModel
{
    protected $table = 'cost_layers';

    protected $casts = [
        'remaining_quantity' => 'decimal:3',
        'unit_cost'          => 'decimal:2',
    ];
}
