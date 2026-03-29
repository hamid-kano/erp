<?php

namespace App\Modules\Accounting\Web\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Infrastructure\Models\Account;
use App\Modules\Accounting\Infrastructure\Models\JournalEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JournalEntryController extends Controller
{
    public function index()
    {
        $entries = JournalEntry::withCount('lines')
            ->orderByDesc('date')
            ->paginate(20);

        return Inertia::render('Accounting/JournalEntries/Index', ['entries' => $entries]);
    }

    public function create()
    {
        return Inertia::render('Accounting/JournalEntries/Form', [
            'accounts' => Account::where('is_active', true)->orderBy('code')->get(['id', 'code', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date'              => ['required', 'date'],
            'description'       => ['required', 'string'],
            'lines'             => ['required', 'array', 'min:2'],
            'lines.*.account_id'=> ['required', 'exists:accounts,id'],
            'lines.*.debit'     => ['required', 'numeric', 'min:0'],
            'lines.*.credit'    => ['required', 'numeric', 'min:0'],
        ]);

        $totalDebit  = collect($request->lines)->sum('debit');
        $totalCredit = collect($request->lines)->sum('credit');

        if (round($totalDebit, 2) !== round($totalCredit, 2)) {
            return back()->withErrors(['lines' => 'القيد غير متوازن - الدائن لا يساوي المدين']);
        }

        DB::transaction(function () use ($request) {
            $entry = JournalEntry::create([
                'date'        => $request->date,
                'description' => $request->description,
                'reference'   => $request->reference,
            ]);

            foreach ($request->lines as $line) {
                $entry->lines()->create($line);
            }
        });

        return redirect()->route('journal-entries.index')->with('success', 'تم حفظ القيد بنجاح');
    }

    public function show(JournalEntry $journalEntry)
    {
        return Inertia::render('Accounting/JournalEntries/Show', [
            'entry' => $journalEntry->load('lines.account'),
        ]);
    }
}
