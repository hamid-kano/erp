<?php

namespace App\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains;

    /**
     * الأعمدة الحقيقية في الجدول
     * باقي البيانات تُخزن في عمود data (JSON)
     */
    public static function getCustomColumns(): array
    {
        return ['id', 'name', 'plan', 'is_active'];
    }

    /**
     * tenancy_db_name مخزنة في data JSON تلقائياً بواسطة stancl
     */
    public function hasDedicatedDatabase(): bool
    {
        return !empty($this->tenancy_db_name);
    }

    public function isShared(): bool
    {
        return !$this->hasDedicatedDatabase();
    }

    /**
     * getDatabaseName مطلوبة من TenantWithDatabase interface
     */
    public function getDatabaseName(): string
    {
        return $this->tenancy_db_name ?? ('erp_tenant_' . $this->id);
    }
}
