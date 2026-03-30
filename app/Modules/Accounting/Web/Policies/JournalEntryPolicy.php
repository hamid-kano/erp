<?php

namespace App\Modules\Accounting\Web\Policies;

use App\Models\User;
use App\Modules\Accounting\Infrastructure\Models\JournalEntry;

class JournalEntryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('accounting.journal.view');
    }

    public function view(User $user, JournalEntry $entry): bool
    {
        return $user->hasPermissionTo('accounting.journal.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('accounting.journal.create');
    }

    public function reverse(User $user, JournalEntry $entry): bool
    {
        return $user->hasPermissionTo('accounting.journal.reverse');
    }
}
