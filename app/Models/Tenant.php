<?php

namespace App\Models;

use App\Modules\Currency\Infrastructure\Models\Currency;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    public static function getCustomColumns(): array
    {
        return ['id', 'name', 'plan', 'is_active', 'base_currency_id'];
    }

    public function hasDedicatedDatabase(): bool
    {
        return !empty($this->tenancy_db_name);
    }

    public function isShared(): bool
    {
        return !$this->hasDedicatedDatabase();
    }

    public function getDatabaseName(): string
    {
        return $this->tenancy_db_name ?? ('erp_tenant_' . $this->id);
    }

    // ── Currency ──────────────────────────────────────────

    public function baseCurrency()
    {
        return $this->belongsTo(Currency::class, 'base_currency_id');
    }

    /**
     * جلب العملة الأساسية أو SAR كافتراضي
     */
    public function getBaseCurrencyAttribute(): Currency
    {
        return $this->baseCurrency ?? Currency::where('code', 'SAR')->first();
    }
}
