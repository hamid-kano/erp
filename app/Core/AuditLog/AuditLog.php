<?php

namespace App\Core\AuditLog;

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
            'tenant_id'  => $model->tenant_id ?? null,
            'user_id'    => auth()->id(),
            'action'     => $action,
            'model_type' => get_class($model),
            'model_id'   => $model->getKey(),
            'old_values' => $old,
            'new_values' => $new,
        ]);
    }
}
