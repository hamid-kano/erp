<?php

namespace App\Core\Tenancy\Middleware;

use App\Core\Tenancy\TenantManager;
use Closure;
use Illuminate\Http\Request;

class InitializeTenant
{
    public function __construct(private TenantManager $tenantManager) {}

    public function handle(Request $request, Closure $next): mixed
    {
        if ($user = $request->user()) {
            $this->tenantManager->setId($user->tenant_id);
        }

        return $next($request);
    }
}
