<?php

namespace App\Modules\Accounting\Web\Policies;

use App\Models\User;

class ReportPolicy
{
    public function viewTrialBalance(User $user): bool
    {
        return $user->hasPermissionTo('accounting.reports.trial_balance');
    }

    public function viewIncomeStatement(User $user): bool
    {
        return $user->hasPermissionTo('accounting.reports.income_statement');
    }

    public function viewBalanceSheet(User $user): bool
    {
        return $user->hasPermissionTo('accounting.reports.balance_sheet');
    }

    public function viewGeneralLedger(User $user): bool
    {
        return $user->hasPermissionTo('accounting.reports.general_ledger');
    }
}
