<?php

namespace App\Modules\CRM\Infrastructure\Models;

use App\Core\BaseModel;

class Customer extends BaseModel
{
    protected $table = 'customers';

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'balance'      => 'decimal:2',
        'is_active'    => 'boolean',
    ];
}
