<?php

namespace App\Modules\Accounting\Infrastructure\Models;

use App\Core\BaseModel;
use App\Core\Shared\Exceptions\DomainException;

class FiscalPeriod extends BaseModel
{
    protected $fillable = [
        'tenant_id', 'name', 'start_date', 'end_date',
        'status', 'closed_at', 'closed_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'closed_at'  => 'datetime',
    ];

    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    public function close(int $userId): void
    {
        if (!$this->isOpen()) {
            throw new DomainException("الفترة [{$this->name}] مغلقة بالفعل");
        }

        $this->update([
            'status'    => 'closed',
            'closed_at' => now(),
            'closed_by' => $userId,
        ]);
    }

    /**
     * إيجاد الفترة المالية التي يقع فيها تاريخ معين
     */
    public static function findForDate(string $tenantId, string $date): ?static
    {
        return static::where('tenant_id', $tenantId)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->first();
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }
}
