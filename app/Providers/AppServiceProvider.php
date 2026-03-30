<?php

namespace App\Providers;

use App\Core\Tenancy\TenantManager;
use App\Modules\Inventory\Domain\Events\StockDepleted;
use App\Modules\Inventory\Application\Listeners\HandleStockDepleted;
use App\Modules\Inventory\Domain\Events\StockWrittenOff;
use App\Modules\Inventory\Application\Listeners\HandleStockWrittenOff;
use App\Modules\Purchasing\Domain\Events\GoodsReceived;
use App\Modules\Purchasing\Application\Listeners\HandleGoodsReceived;
use App\Modules\Sales\Domain\Events\InvoiceIssued;
use App\Modules\Sales\Application\Listeners\HandleInvoiceIssued;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\FiscalPeriod;
use App\Modules\Accounting\Infrastructure\Models\JournalEntry;
use App\Modules\Accounting\Web\Policies\AccountPolicy;
use App\Modules\Accounting\Web\Policies\FiscalPeriodPolicy;
use App\Modules\Accounting\Web\Policies\JournalEntryPolicy;
use App\Modules\Accounting\Web\Policies\ReportPolicy;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->registerPolicies();
        $this->registerEvents();
        $this->shareInertiaData();
    }

    private function registerPolicies(): void
    {
        Gate::policy(Account::class,       AccountPolicy::class);
        Gate::policy(JournalEntry::class,  JournalEntryPolicy::class);
        Gate::policy(FiscalPeriod::class,  FiscalPeriodPolicy::class);
        Gate::define('viewTrialBalance',   [ReportPolicy::class, 'viewTrialBalance']);
    }

    private function registerEvents(): void
    {
        Event::listen(GoodsReceived::class,   HandleGoodsReceived::class);
        Event::listen(InvoiceIssued::class,    HandleInvoiceIssued::class);
        Event::listen(StockDepleted::class,    HandleStockDepleted::class);
        Event::listen(StockWrittenOff::class,  HandleStockWrittenOff::class);
    }

    private function shareInertiaData(): void
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
            'currency' => fn () => app(TenantManager::class)->getBaseCurrency()
                ? [
                    'code'   => app(TenantManager::class)->getBaseCurrency()->code,
                    'symbol' => app(TenantManager::class)->getBaseCurrency()->symbol,
                    'decimal_places' => app(TenantManager::class)->getBaseCurrency()->decimal_places,
                ] : ['code' => 'SAR', 'symbol' => 'ر.س', 'decimal_places' => 2],
            'flash' => fn () => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}
