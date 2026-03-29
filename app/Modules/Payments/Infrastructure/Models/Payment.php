<?php

namespace App\Modules\Payments\Infrastructure\Models;

use App\Core\BaseModel;
use App\Modules\Currency\Infrastructure\Models\Currency;

class Payment extends BaseModel
{
    protected $fillable = [
        'tenant_id', 'currency_id', 'exchange_rate',
        'amount', 'amount_base', 'method', 'date',
        'direction', 'reference', 'reference_type',
        'reference_id', 'notes', 'created_by',
    ];

    protected $casts = [
        'date'          => 'date',
        'amount'        => 'decimal:2',
        'amount_base'   => 'decimal:2',
        'exchange_rate' => 'decimal:8',
    ];

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }
}
