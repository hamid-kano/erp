<?php

namespace App\Modules\Currency\Domain\Services;

use App\Core\Shared\Exceptions\DomainException;
use App\Modules\Currency\Infrastructure\Models\Currency;
use App\Modules\Currency\Infrastructure\Models\ExchangeRate;
use Illuminate\Support\Facades\Cache;

class CurrencyService
{
    /**
     * تحويل مبلغ من عملة لأخرى
     */
    public function convert(float $amount, int $fromCurrencyId, int $toCurrencyId, string $date = null): float
    {
        if ($fromCurrencyId === $toCurrencyId) {
            return $amount;
        }

        $rate = $this->getRate($fromCurrencyId, $toCurrencyId, $date ?? now()->toDateString());

        return round($amount * $rate, 8);
    }

    /**
     * جلب سعر الصرف - يبحث عن أقرب تاريخ متاح
     */
    public function getRate(int $fromId, int $toId, string $date): float
    {
        $cacheKey = "exchange_rate:{$fromId}:{$toId}:{$date}";

        return Cache::remember($cacheKey, 3600, function () use ($fromId, $toId, $date) {
            // نبحث عن سعر في نفس التاريخ أو أقرب تاريخ سابق
            $rate = ExchangeRate::where('from_currency_id', $fromId)
                ->where('to_currency_id', $toId)
                ->where('date', '<=', $date)
                ->orderByDesc('date')
                ->value('rate');

            if ($rate) {
                return (float) $rate;
            }

            // نحاول العكس (لو عندنا USD→SAR نحسب SAR→USD)
            $inverseRate = ExchangeRate::where('from_currency_id', $toId)
                ->where('to_currency_id', $fromId)
                ->where('date', '<=', $date)
                ->orderByDesc('date')
                ->value('rate');

            if ($inverseRate) {
                return round(1 / (float) $inverseRate, 8);
            }

            throw new DomainException(
                "لا يوجد سعر صرف متاح من العملة #{$fromId} إلى #{$toId} بتاريخ {$date}"
            );
        });
    }

    /**
     * تسجيل سعر صرف جديد
     */
    public function setRate(int $fromId, int $toId, float $rate, string $date = null): ExchangeRate
    {
        $date = $date ?? now()->toDateString();

        $exchangeRate = ExchangeRate::updateOrCreate(
            ['from_currency_id' => $fromId, 'to_currency_id' => $toId, 'date' => $date],
            ['rate' => $rate]
        );

        // نمسح الـ cache
        Cache::forget("exchange_rate:{$fromId}:{$toId}:{$date}");

        return $exchangeRate;
    }

    /**
     * تحويل مبلغ للعملة الأساسية للـ tenant
     */
    public function toBase(float $amount, int $currencyId, int $baseCurrencyId, string $date = null): float
    {
        return $this->convert($amount, $currencyId, $baseCurrencyId, $date);
    }
}
