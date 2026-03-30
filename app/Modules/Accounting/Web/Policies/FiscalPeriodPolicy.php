<?php

namespace App\Modules\Accounting\Web\Policies;

use App\Models\User;
use App\Modules\Accounting\Infrastructure\Models\FiscalPeriod;

class FiscalPeriodPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('accounting.fiscal_period.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('accounting.fiscal_period.create');
    }

    public function close(User $user, FiscalPeriod $period): bool
    {
        return $user->hasPermissionTo('accounting.fiscal_period.close');
    }
}
