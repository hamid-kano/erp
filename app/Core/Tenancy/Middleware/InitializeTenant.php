<?php

namespace App\Core\Tenancy\Middleware;

use App\Core\Tenancy\TenantManager;
use Closure;
use Illuminate\Http\Request;
use Stancl\Tenancy\Tenancy;

class InitializeTenant
{
    public function __construct(
        protected TenantManager $manager,
        protected Tenancy $tenancy
    ) {}

    public function handle(Request $request, Closure $next)
    {
        // تهيئة الـ TenantManager من الـ session
        $this->manager->initialize();

        $tenant = $this->manager->current();

        if ($tenant && $tenant->hasDedicatedDatabase()) {
            // Dedicated: نبدّل قاعدة البيانات عبر stancl/tenancy
            $this->tenancy->initialize($tenant);
        }

        $response = $next($request);

        // بعد الـ request نرجع للـ central DB لو كنا في Dedicated
        if ($tenant && $tenant->hasDedicatedDatabase()) {
            $this->tenancy->end();
        }

        return $response;
    }
}
