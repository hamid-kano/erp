<?php

namespace App\Core\DocumentSequence;

use App\Core\Tenancy\TenantManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DocumentSequence extends Model
{
    protected $guarded = ['id'];

    public static function next(string $module): string
    {
        $tenantId = app(TenantManager::class)->getId() ?? 'system';

        return DB::transaction(function () use ($module, $tenantId) {
            $year   = now()->year;
            $prefix = strtoupper(substr($module, 0, 3));

            $seq = static::lockForUpdate()->firstOrCreate(
                ['tenant_id' => $tenantId, 'module' => $module, 'year' => $year],
                ['prefix' => $prefix, 'last_number' => 0]
            );

            $seq->increment('last_number');
            $seq->refresh();

            return sprintf('%s-%d-%05d', $seq->prefix, $year, $seq->last_number);
        });
    }
}
