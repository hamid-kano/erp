<?php

namespace Database\Seeders;

use App\Modules\Accounting\Infrastructure\Models\AccountTemplate;
use App\Modules\Accounting\Infrastructure\Models\AccountTemplateItem;
use Illuminate\Database\Seeder;

class AccountTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $template = AccountTemplate::create([
            'name'        => 'تجارة عامة - IFRS',
            'description' => 'شجرة حسابات قياسية للتجارة العامة',
        ]);

        $items = [
            // ── أصول ──────────────────────────────────────
            ['code' => '1000', 'name' => 'الأصول',                    'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => false, 'parent' => null],
            ['code' => '1100', 'name' => 'الأصول المتداولة',           'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => false, 'parent' => '1000'],
            ['code' => '1110', 'name' => 'النقدية وما يعادلها',        'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '1100'],
            ['code' => '1120', 'name' => 'البنك',                      'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '1100'],
            ['code' => '1130', 'name' => 'الذمم المدينة (عملاء)',      'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '1100'],
            ['code' => '1140', 'name' => 'المخزون',                    'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '1100'],
            ['code' => '1150', 'name' => 'مصاريف مدفوعة مقدماً',      'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '1100'],
            ['code' => '1200', 'name' => 'الأصول غير المتداولة',       'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => false, 'parent' => '1000'],
            ['code' => '1210', 'name' => 'الأصول الثابتة',             'type' => 'asset',     'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '1200'],
            ['code' => '1220', 'name' => 'مجمع الإهلاك',               'type' => 'asset',     'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '1200'],

            // ── خصوم ──────────────────────────────────────
            ['code' => '2000', 'name' => 'الخصوم',                     'type' => 'liability', 'normal_balance' => 'credit', 'is_postable' => false, 'parent' => null],
            ['code' => '2100', 'name' => 'الخصوم المتداولة',           'type' => 'liability', 'normal_balance' => 'credit', 'is_postable' => false, 'parent' => '2000'],
            ['code' => '2110', 'name' => 'الذمم الدائنة (موردون)',     'type' => 'liability', 'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '2100'],
            ['code' => '2120', 'name' => 'مصاريف مستحقة',              'type' => 'liability', 'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '2100'],
            ['code' => '2130', 'name' => 'ضريبة القيمة المضافة',       'type' => 'liability', 'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '2100'],

            // ── حقوق الملكية ──────────────────────────────
            ['code' => '3000', 'name' => 'حقوق الملكية',               'type' => 'equity',    'normal_balance' => 'credit', 'is_postable' => false, 'parent' => null],
            ['code' => '3100', 'name' => 'رأس المال',                  'type' => 'equity',    'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '3000'],
            ['code' => '3200', 'name' => 'الأرباح المحتجزة',           'type' => 'equity',    'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '3000'],
            ['code' => '3300', 'name' => 'الأرباح والخسائر',           'type' => 'equity',    'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '3000'],

            // ── إيرادات ───────────────────────────────────
            ['code' => '4000', 'name' => 'الإيرادات',                  'type' => 'revenue',   'normal_balance' => 'credit', 'is_postable' => false, 'parent' => null],
            ['code' => '4100', 'name' => 'إيرادات المبيعات',           'type' => 'revenue',   'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '4000'],
            ['code' => '4200', 'name' => 'إيرادات أخرى',               'type' => 'revenue',   'normal_balance' => 'credit', 'is_postable' => true,  'parent' => '4000'],

            // ── مصاريف ────────────────────────────────────
            ['code' => '5000', 'name' => 'المصاريف',                   'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => false, 'parent' => null],
            ['code' => '5100', 'name' => 'تكلفة البضاعة المباعة',      'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '5000'],
            ['code' => '5200', 'name' => 'مصاريف التشغيل',             'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => false, 'parent' => '5000'],
            ['code' => '5210', 'name' => 'الرواتب والأجور',            'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '5200'],
            ['code' => '5220', 'name' => 'الإيجار',                    'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '5200'],
            ['code' => '5230', 'name' => 'المصاريف الإدارية',          'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '5200'],
            ['code' => '5300', 'name' => 'مصاريف التمويل',             'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => false, 'parent' => '5000'],
            ['code' => '5310', 'name' => 'فوائد بنكية',                'type' => 'expense',   'normal_balance' => 'debit',  'is_postable' => true,  'parent' => '5300'],
        ];

        $idMap = [];

        foreach ($items as $item) {
            $parentId = $item['parent'] ? ($idMap[$item['parent']] ?? null) : null;

            $record = AccountTemplateItem::create([
                'template_id'    => $template->id,
                'parent_id'      => $parentId,
                'code'           => $item['code'],
                'name'           => $item['name'],
                'type'           => $item['type'],
                'normal_balance' => $item['normal_balance'],
                'is_postable'    => $item['is_postable'],
            ]);

            $idMap[$item['code']] = $record->id;
        }
    }
}
