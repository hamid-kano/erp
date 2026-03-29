<?php

namespace App\Modules\Payments\Infrastructure\Models;

use App\Core\BaseModel;

class Payment extends BaseModel
{
    protected $fillable = [
        'tenant_id', 'amount', 'method', 'date',
        'reference_type', 'reference_id', 'direction', 'notes',
    ];

    protected $casts = ['date' => 'date', 'amount' => 'decimal:2'];

    public function reference()
    {
        return $this->morphTo();
    }
}
