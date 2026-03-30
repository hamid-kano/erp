<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Domain\Services\PostingService;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalEntry;
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

    public function store(Request $request)
    {
        $this->authorize('create', JournalEntry::class);

        $request->validate([
            'date'               => ['required', 'date'],
            'description'        => ['required', 'string'],
            'lines'              => ['required', 'array', 'min:2'],
            'lines.*.account_id' => ['required', 'exists:accounts,id'],
            'lines.*.debit'      => ['required', 'numeric', 'min:0'],
            'lines.*.credit'     => ['required', 'numeric', 'min:0'],
        ]);

        $this->postingService->post([
            'date'        => $request->date,
            'description' => $request->description,
            'reference'   => $request->reference,
            'lines'       => $request->lines,
        ]);

        return redirect()->route('journal-entries.index')->with('success', 'تم حفظ القيد وترحيله بنجاح');
    }

    public function show(JournalEntry $journalEntry)
    {
        $this->authorize('view', $journalEntry);

        return Inertia::render('Accounting/JournalEntries/Show', [
            'entry' => $journalEntry->load('lines.account'),
        ]);
    }
}
