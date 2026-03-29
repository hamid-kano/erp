<?php

namespace App\Core\AuditLog;

use App\Core\Tenancy\TenantManager;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public static function record(string $action, Model $model, array $old = [], array $new = []): void
    {
        static::create([
            'tenant_id'  => app(TenantManager::class)->getId(),
            'user_id'    => auth()->id(),
            'action'     => $action,
            'model_type' => get_class($model),
            'model_id'   => $model->getKey(),
            'old_values' => $old,
            'new_values' => $new,
        ]);
    }
}
