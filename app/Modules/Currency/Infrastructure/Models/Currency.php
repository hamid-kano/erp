<?php

namespace App\Modules\Currency\Infrastructure\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $fillable = ['code', 'name', 'symbol', 'decimal_places', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function exchangeRatesFrom()
    {
        return $this->hasMany(ExchangeRate::class, 'from_currency_id');
    }

    public function exchangeRatesTo()
    {
        return $this->hasMany(ExchangeRate::class, 'to_currency_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function format(float $amount): string
    {
        return $this->symbol . ' ' . number_format($amount, $this->decimal_places);
    }
}
