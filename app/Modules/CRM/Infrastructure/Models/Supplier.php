<?php

namespace App\Modules\CRM\Infrastructure\Models;

use App\Core\BaseModel;

class Supplier extends BaseModel
{
    protected $table = 'suppliers';

    protected $casts = [
        'payment_terms' => 'integer',
        'balance'       => 'decimal:2',
        'is_active'     => 'boolean',
    ];
}
