<?php

namespace App\Core\Tenancy\Traits;

use App\Core\Tenancy\TenantManager;
use App\Core\Tenancy\TenantScope;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (empty($model->tenant_id)) {
                $model->tenant_id = app(TenantManager::class)->getId();
            }
        });
    }
}
