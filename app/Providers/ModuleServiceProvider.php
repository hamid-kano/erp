<?php

namespace App\Providers;

use App\Core\Tenancy\TenantManager;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(TenantManager::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom([
            database_path('migrations/core'),
            database_path('migrations/crm'),
            database_path('migrations/inventory'),
            database_path('migrations/warehouse'),
            database_path('migrations/purchasing'),
            database_path('migrations/sales'),
            database_path('migrations/payments'),
            database_path('migrations/accounting'),
        ]);
    }
}
