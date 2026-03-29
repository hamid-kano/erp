<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Inertia::share([
            'auth' => fn () => [
                'user' => Auth::user() ? [
                    'id'          => Auth::user()->id,
                    'name'        => Auth::user()->name,
                    'email'       => Auth::user()->email,
                    'tenant_id'   => Auth::user()->tenant_id,
                    'roles'       => Auth::user()->getRoleNames(),
                    'permissions' => Auth::user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'flash' => fn () => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}
