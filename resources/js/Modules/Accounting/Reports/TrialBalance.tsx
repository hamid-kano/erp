import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, FileText } from 'lucide-react';

interface AccountRow {
    id: number; code: string; name: string;
    type: string; normal_balance: string;
    depth: number; debit: number; credit: number; balance: number;
}

const typeLabels: Record<string, string> = {
    asset: 'أصول', liability: 'خصوم', equity: 'حقوق ملكية',
    revenue: 'إيرادات', expense: 'مصاريف',
};

const typeColors: Record<string, string> = {
    asset: 'text-blue-400', liability: 'text-red-400',
    equity: 'text-purple-400', revenue: 'text-green-400', expense: 'text-yellow-400',
};

export default function TrialBalance({ accounts, total_debit, total_credit, is_balanced, from, to }: {
    accounts: AccountRow[];
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
    from: string;
    to: string;
}) {
    const [fromDate, setFromDate] = useState(from);
    const [toDate,   setToDate]   = useState(to);

    const search = () => {
        router.get('/reports/trial-balance', { from: fromDate, to: toDate }, { preserveState: true });
    };

    const fmt = (n: number) => Number(n).toLocaleString('ar', { minimumFractionDigits: 2 });

    return (
        <AppLayout>
            <Head title="ميزان المراجعة" />
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-400" />
                        <h1 className="text-xl font-bold text-white">ميزان المراجعة</h1>
                    </div>
                    {is_balanced ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle size={16} /> متوازن
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <XCircle size={16} /> غير متوازن
                        </div>
                    )}
                </div>

                {/* Filter */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-end gap-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">من تاريخ</label>
                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">إلى تاريخ</label>
                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <button onClick={search}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        عرض
                    </button>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800 bg-slate-800/50">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">الكود</th>
                                <th className="text-right px-4 py-3">اسم الحساب</th>
                                <th className="text-right px-4 py-3">النوع</th>
                                <th className="text-left px-4 py-3">مدين</th>
                                <th className="text-left px-4 py-3">دائن</th>
                                <th className="text-left px-4 py-3">الرصيد</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                                        لا توجد قيود في هذه الفترة
                                    </td>
                                </tr>
                            ) : accounts.map(a => (
                                <tr key={a.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-2.5">
                                        <span className="text-blue-400 font-mono text-xs">{a.code}</span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-1"
                                            style={{ paddingRight: `${a.depth * 12}px` }}>
                                            {a.depth > 0 && <ChevronRight size={11} className="text-slate-600 shrink-0" />}
                                            <span className={`text-white ${a.depth === 0 ? 'font-semibold' : ''}`}>
                                                {a.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`px-4 py-2.5 text-xs ${typeColors[a.type]}`}>
                                        {typeLabels[a.type]}
                                    </td>
                                    <td className="px-4 py-2.5 text-left text-slate-300 font-mono text-xs">
                                        {a.debit > 0 ? fmt(a.debit) : '-'}
                                    </td>
                                    <td className="px-4 py-2.5 text-left text-slate-300 font-mono text-xs">
                                        {a.credit > 0 ? fmt(a.credit) : '-'}
                                    </td>
                                    <td className={`px-4 py-2.5 text-left font-mono text-xs font-medium ${a.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {fmt(Math.abs(a.balance))}
                                        {a.balance < 0 && <span className="text-xs mr-1">(د)</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* Totals */}
                        <tfoot className="border-t-2 border-slate-700 bg-slate-800/50">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-slate-300 font-semibold text-sm">
                                    الإجمالي
                                </td>
                                <td className="px-4 py-3 text-left font-mono text-sm font-bold text-white">
                                    {fmt(total_debit)}
                                </td>
                                <td className="px-4 py-3 text-left font-mono text-sm font-bold text-white">
                                    {fmt(total_credit)}
                                </td>
                                <td className="px-4 py-3 text-left">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${is_balanced ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {is_balanced ? '✓ متوازن' : '✗ غير متوازن'}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
