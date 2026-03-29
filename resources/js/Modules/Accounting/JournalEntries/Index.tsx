import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';

interface Entry {
    id: number; date: string; description: string;
    reference: string; posted_at: string | null; lines_count: number;
}

export default function JournalEntriesIndex({ entries }: { entries: { data: Entry[] } }) {
    return (
        <AppLayout>
            <Head title="القيود المحاسبية" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">القيود المحاسبية</h1>
                    <Link href="/journal-entries/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> قيد جديد
                    </Link>
                </div>
                <Flash />
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">التاريخ</th>
                                <th className="text-right px-4 py-3">الوصف</th>
                                <th className="text-right px-4 py-3">المرجع</th>
                                <th className="text-right px-4 py-3">السطور</th>
                                <th className="text-right px-4 py-3">الحالة</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {entries.data.map(e => (
                                <tr key={e.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-slate-300">{e.date}</td>
                                    <td className="px-4 py-3 text-white">{e.description}</td>
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{e.reference || '-'}</td>
                                    <td className="px-4 py-3 text-slate-300">{e.lines_count}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${e.posted_at ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {e.posted_at ? 'مرحّل' : 'مسودة'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/journal-entries/${e.id}`} className="text-slate-400 hover:text-blue-400"><Eye size={15} /></Link>
                                    </td>
                                </tr>
                            ))}
                            {entries.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">لا توجد قيود</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
