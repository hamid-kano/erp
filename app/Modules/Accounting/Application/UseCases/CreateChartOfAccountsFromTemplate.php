<?php

namespace App\Modules\Accounting\Application\UseCases;

use App\Models\Tenant;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\AccountTemplate;
use App\Modules\Accounting\Infrastructure\Models\AccountTemplateItem;
use Illuminate\Support\Facades\DB;

class CreateChartOfAccountsFromTemplate
{
    public function execute(Tenant $tenant, int $templateId): void
    {
        $template = AccountTemplate::with('items')->findOrFail($templateId);

        DB::transaction(function () use ($tenant, $template) {
            // نبني map من template_item_id → account_id للربط الهرمي
            $idMap = [];

            // نمشي على العناصر بالترتيب (الآباء قبل الأبناء)
            $items = $template->items->sortBy('_lft');

            foreach ($items as $item) {
                $account = Account::create([
                    'tenant_id'        => $tenant->id,
                    'template_item_id' => $item->id,
                    'parent_id'        => $item->parent_id ? ($idMap[$item->parent_id] ?? null) : null,
                    'code'             => $item->code,
                    'name'             => $item->name,
                    'type'             => $item->type,
                    'normal_balance'   => $item->normal_balance,
                    'is_postable'      => $item->is_postable,
                ]);

                $idMap[$item->id] = $account->id;
            }

            // نعيد بناء الـ Nested Set بعد الإدراج
            Account::where('tenant_id', $tenant->id)->fixTree();
        });
    }
}
