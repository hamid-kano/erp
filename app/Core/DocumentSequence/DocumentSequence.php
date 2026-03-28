<?php

namespace App\Core\DocumentSequence;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DocumentSequence extends Model
{
    protected $guarded = ['id'];

    public static function next(string $module, int $tenantId): string
    {
        return DB::transaction(function () use ($module, $tenantId) {
            $year = now()->year;

            $seq = static::lockForUpdate()->firstOrCreate(
                ['tenant_id' => $tenantId, 'module' => $module, 'year' => $year],
                ['prefix' => strtoupper(substr($module, 0, 3)), 'last_number' => 0]
            );

            $seq->increment('last_number');
            $seq->refresh();

            return sprintf('%s-%d-%05d', $seq->prefix, $year, $seq->last_number);
        });
    }
}
