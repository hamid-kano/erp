<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AccountTemplateSeeder::class);
        $this->call(CurrencySeeder::class);

        // جلب عملة الريال السعودي
        $sar = \App\Modules\Currency\Infrastructure\Models\Currency::where('code', 'SAR')->first();

        // Shared Tenant (صغير)
        $sharedTenant = Tenant::create([
            'id'               => 'demo-shared',
            'name'             => 'شركة تجريبية (مشتركة)',
            'plan'             => 'starter',
            'tenancy_db_name'  => null,
            'base_currency_id' => $sar?->id,
        ]);

        User::create([
            'tenant_id' => $sharedTenant->id,
            'name'      => 'مدير النظام',
            'email'     => 'admin@erp.test',
            'password'  => Hash::make('password'),
        ]);

        // Dedicated Tenant (كبير) - قاعدة بيانات منفصلة
        // $dedicatedTenant = Tenant::create([
        //     'id'              => 'enterprise-client',
        //     'name'            => 'شركة كبيرة (مخصصة)',
        //     'plan'            => 'enterprise',
        //     'tenancy_db_name' => 'erp_tenant_enterprise',
        // ]);
        // $dedicatedTenant->run(function () {
        //     // migrations تشغل تلقائياً عند إنشاء الـ tenant
        // });
    }
}
