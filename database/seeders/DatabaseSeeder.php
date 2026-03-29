<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // إنشاء tenant تجريبي
        $tenantId = DB::table('tenants')->insertGetId([
            'name'       => 'شركة تجريبية',
            'domain'     => 'demo',
            'plan'       => 'starter',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // إنشاء مستخدم admin
        User::create([
            'tenant_id' => $tenantId,
            'name'      => 'مدير النظام',
            'email'     => 'admin@erp.test',
            'password'  => Hash::make('password'),
        ]);
    }
}
