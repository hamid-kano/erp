<?php

namespace Database\Seeders;

use App\Modules\Currency\Infrastructure\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            ['code' => 'SAR', 'name' => 'ريال سعودي',      'symbol' => 'ر.س',  'decimal_places' => 2],
            ['code' => 'USD', 'name' => 'دولار أمريكي',    'symbol' => '$',    'decimal_places' => 2],
            ['code' => 'EUR', 'name' => 'يورو',             'symbol' => '€',    'decimal_places' => 2],
            ['code' => 'AED', 'name' => 'درهم إماراتي',    'symbol' => 'د.إ',  'decimal_places' => 2],
            ['code' => 'KWD', 'name' => 'دينار كويتي',     'symbol' => 'د.ك',  'decimal_places' => 3],
            ['code' => 'BHD', 'name' => 'دينار بحريني',    'symbol' => 'د.ب',  'decimal_places' => 3],
            ['code' => 'QAR', 'name' => 'ريال قطري',       'symbol' => 'ر.ق',  'decimal_places' => 2],
            ['code' => 'OMR', 'name' => 'ريال عماني',      'symbol' => 'ر.ع',  'decimal_places' => 3],
            ['code' => 'GBP', 'name' => 'جنيه إسترليني',   'symbol' => '£',    'decimal_places' => 2],
            ['code' => 'EGP', 'name' => 'جنيه مصري',       'symbol' => 'ج.م',  'decimal_places' => 2],
            ['code' => 'JOD', 'name' => 'دينار أردني',     'symbol' => 'د.أ',  'decimal_places' => 3],
        ];

        foreach ($currencies as $currency) {
            Currency::firstOrCreate(['code' => $currency['code']], $currency);
        }
    }
}
