<?php

namespace App\Modules\Accounting\Web\Policies;

use App\Models\User;
use App\Modules\Accounting\Infrastructure\Models\Account;

class AccountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('accounting.accounts.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('accounting.accounts.create');
    }

    public function update(User $user, Account $account): bool
    {
        return $user->hasPermissionTo('accounting.accounts.edit');
    }

    public function setupTemplate(User $user): bool
    {
        return $user->hasPermissionTo('accounting.accounts.create');
    }
}
