<?php

namespace App\Core\Tenancy;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $manager = app(TenantManager::class);

        // Dedicated tenant = DB منفصلة = لا نحتاج tenant_id filter
        if ($manager->isDedicated()) {
            return;
        }

        // Shared tenant = نفلتر بـ tenant_id
        $tenantId = $manager->getId();

        if ($tenantId) {
            $builder->where($model->getTable() . '.tenant_id', $tenantId);
        }
    }
}
