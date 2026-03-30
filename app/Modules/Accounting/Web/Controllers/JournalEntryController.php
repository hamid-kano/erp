<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Domain\Services\PostingService;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalEntry;
use App\Modules\Accounting\Web\Requests\JournalEntryRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalEntryController extends Controller
{
    public function __construct(private PostingService $postingService) {}

    public function index()
    {
        $this->authorize('viewAny', JournalEntry::class);

        $entries = JournalEntry::withCount('lines')
            ->orderByDesc('date')
            ->paginate(20);

        return Inertia::render('Accounting/JournalEntries/Index', ['entries' => $entries]);
    }

    public function create()
    {
        $this->authorize('create', JournalEntry::class);

        return Inertia::render('Accounting/JournalEntries/Form', [
            'accounts' => Account::postable()->orderBy('_lft')->get(['id', 'code', 'name']),
        ]);
    }

    public function store(JournalEntryRequest $request)
    {
        $this->authorize('create', JournalEntry::class);

        $this->postingService->post($request->validated());

        return redirect()->route('journal-entries.index')->with('success', 'تم حفظ القيد وترحيله بنجاح');
    }

    public function show(JournalEntry $journalEntry)
    {
        $this->authorize('view', $journalEntry);

        return Inertia::render('Accounting/JournalEntries/Show', [
            'entry' => $journalEntry->load('lines.account', 'reversedEntry'),
        ]);
    }

    public function reverse(Request $request, JournalEntry $journalEntry)
    {
        $this->authorize('reverse', $journalEntry);

        $request->validate(['reason' => ['required', 'string', 'max:255']]);

        $this->postingService->reverse($journalEntry, $request->reason);

        return redirect()->route('journal-entries.show', $journalEntry)
            ->with('success', 'تم عكس القيد بنجاح');
    }
}
