import AppLayout from '@/Core/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Line { id: number; debit: number; credit: number; account: { code: string; name: string }; }
interface Entry { id: number; date: string; description: string; reference: string; posted_at: string | null; lines: Line[]; }

export default function JournalEntryShow({ entry }: { entry: Entry }) {
    const totalDebit  = entry.lines.reduce((s, l) => s + +l.debit, 0);
    const totalCredit = entry.lines.reduce((s, l) => s + +l.credit, 0);

    return (
        <AppLayout>
            <Head title="تفاصيل القيد" />
            <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-3">
                    <a href="/journal-entries" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                    <h1 className="text-xl font-bold text-white">تفاصيل القيد</h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${entry.posted_at ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                        {entry.posted_at ? 'مرحّل' : 'مسودة'}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'التاريخ', value: entry.date },
                        { label: 'الوصف', value: entry.description },
                        { label: 'المرجع', value: entry.reference || '-' },
                    ].map(item => (
                        <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                            <p className="text-white font-medium">{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">الحساب</th>
                                <th className="text-right px-4 py-3">مدين</th>
                                <th className="text-right px-4 py-3">دائن</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {entry.lines.map(line => (
                                <tr key={line.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-white">{line.account?.code} - {line.account?.name}</td>
                                    <td className="px-4 py-3 text-green-400">{+line.debit > 0 ? Number(line.debit).toLocaleString() : '-'}</td>
                                    <td className="px-4 py-3 text-red-400">{+line.credit > 0 ? Number(line.credit).toLocaleString() : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-slate-700 bg-slate-800/30">
                            <tr>
                                <td className="px-4 py-3 text-slate-400 font-medium">الإجمالي</td>
                                <td className="px-4 py-3 text-green-400 font-bold">{totalDebit.toLocaleString()}</td>
                                <td className="px-4 py-3 text-red-400 font-bold">{totalCredit.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
