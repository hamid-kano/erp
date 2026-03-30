<?php

namespace App\Modules\Accounting\Web\Policies;

use App\Models\User;

class ReportPolicy
{
    public function viewTrialBalance(User $user): bool
    {
        return $user->hasPermissionTo('accounting.reports.trial_balance');
    }
}
