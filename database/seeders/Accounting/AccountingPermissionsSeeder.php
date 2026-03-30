<?php

namespace Database\Seeders\Accounting;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccountingPermissionsSeeder extends Seeder
{
    private const PERMISSIONS = [
        'accounting.accounts.view',
        'accounting.accounts.create',
        'accounting.accounts.edit',
        'accounting.journal.view',
        'accounting.journal.create',
        'accounting.journal.reverse',
        'accounting.reports.trial_balance',
    ];

    public function run(): void
    {
        foreach (self::PERMISSIONS as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // محاسب — إنشاء وعرض بدون عكس القيود
        $accountant = Role::firstOrCreate(['name' => 'accountant', 'guard_name' => 'web']);
        $accountant->syncPermissions([
            'accounting.accounts.view',
            'accounting.accounts.create',
            'accounting.accounts.edit',
            'accounting.journal.view',
            'accounting.journal.create',
            'accounting.reports.trial_balance',
        ]);

        // مدير مالي — كل الصلاحيات
        $financeManager = Role::firstOrCreate(['name' => 'finance_manager', 'guard_name' => 'web']);
        $financeManager->syncPermissions(self::PERMISSIONS);

        // مراجع — عرض فقط
        $auditor = Role::firstOrCreate(['name' => 'auditor', 'guard_name' => 'web']);
        $auditor->syncPermissions([
            'accounting.accounts.view',
            'accounting.journal.view',
            'accounting.reports.trial_balance',
        ]);

        // مدير النظام — كل الصلاحيات
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions(self::PERMISSIONS);
    }
}
