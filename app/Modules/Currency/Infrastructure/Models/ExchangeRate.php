<?php

namespace App\Modules\Currency\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    protected $fillable = ['from_currency_id', 'to_currency_id', 'rate', 'date'];

    protected $casts = ['date' => 'date', 'rate' => 'decimal:8'];

    public function fromCurrency()
    {
        return $this->belongsTo(Currency::class, 'from_currency_id');
    }

    public function toCurrency()
    {
        return $this->belongsTo(Currency::class, 'to_currency_id');
    }
}
