<?php

namespace App\Core\Tenancy;

use App\Models\Tenant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class TenantManager
{
    protected ?Tenant $current = null;

    /**
     * تهيئة الـ tenant من الـ session بعد Login
     */
    public function initialize(): void
    {
        $tenantId = Session::get('tenant_id');

        if (!$tenantId && Auth::check()) {
            $tenantId = Auth::user()->tenant_id;
            Session::put('tenant_id', $tenantId);
        }

        if ($tenantId) {
            $this->current = Tenant::find($tenantId);
        }
    }

    public function current(): ?Tenant
    {
        return $this->current;
    }

    public function getId(): ?string
    {
        return $this->current?->id;
    }

    /**
     * هل الـ tenant الحالي يستخدم DB منفصلة؟
     */
    public function isDedicated(): bool
    {
        return $this->current?->hasDedicatedDatabase() ?? false;
    }

    /**
     * هل الـ tenant الحالي يستخدم DB مشتركة؟
     */
    public function isShared(): bool
    {
        return !$this->isDedicated();
    }

    public function set(Tenant $tenant): void
    {
        $this->current = $tenant;
        Session::put('tenant_id', $tenant->id);
    }

    public function forget(): void
    {
        $this->current = null;
        Session::forget('tenant_id');
    }
}
