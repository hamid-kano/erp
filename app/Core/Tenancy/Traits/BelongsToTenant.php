<?php

namespace App\Core\Tenancy\Traits;

use App\Core\Tenancy\TenantManager;
use App\Core\Tenancy\TenantScope;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        // نطبق الـ scope فقط على الـ Shared tenants
        // الـ Dedicated tenants لديهم DB منفصلة = عزل تلقائي
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            $manager = app(TenantManager::class);

            // لو Dedicated tenant = لا نحتاج tenant_id
            if ($manager->isDedicated()) {
                return;
            }

            // Shared tenant = نضيف tenant_id تلقائياً
            if (empty($model->tenant_id) && $manager->getId()) {
                $model->tenant_id = $manager->getId();
            }
        });
    }
}
