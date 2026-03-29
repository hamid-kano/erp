import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';

interface Order {
    id: number; number: string; date: string;
    status: string; total: number;
    customer: { name: string };
}

const statusMap: Record<string, { label: string; color: string }> = {
    draft:     { label: 'مسودة',  color: 'bg-slate-700 text-slate-300' },
    confirmed: { label: 'مؤكد',   color: 'bg-blue-500/10 text-blue-400' },
    shipped:   { label: 'مشحون',  color: 'bg-purple-500/10 text-purple-400' },
    completed: { label: 'مكتمل',  color: 'bg-green-500/10 text-green-400' },
    cancelled: { label: 'ملغي',   color: 'bg-red-500/10 text-red-400' },
};

export default function SalesIndex({ orders, filters }: { orders: { data: Order[] }; filters: any }) {
    return (
        <AppLayout>
            <Head title="أوامر البيع" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">أوامر البيع</h1>
                    <Link href="/sales-orders/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> أمر بيع جديد
                    </Link>
                </div>
                <Flash />
                <div className="flex gap-2 flex-wrap">
                    {['', 'draft', 'confirmed', 'shipped', 'completed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => router.get('/sales-orders', s ? { status: s } : {})}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${filters.status === s || (!filters.status && !s) ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                            {s ? statusMap[s]?.label : 'الكل'}
                        </button>
                    ))}
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">الرقم</th>
                                <th className="text-right px-4 py-3">العميل</th>
                                <th className="text-right px-4 py-3">التاريخ</th>
                                <th className="text-right px-4 py-3">الإجمالي</th>
                                <th className="text-right px-4 py-3">الحالة</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {orders.data.map(o => (
                                <tr key={o.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-blue-400 font-mono">{o.number}</td>
                                    <td className="px-4 py-3 text-white">{o.customer?.name}</td>
                                    <td className="px-4 py-3 text-slate-300">{o.date}</td>
                                    <td className="px-4 py-3 text-white">{Number(o.total).toLocaleString()} ر.س</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusMap[o.status]?.color}`}>
                                            {statusMap[o.status]?.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/sales-orders/${o.id}`} className="text-slate-400 hover:text-blue-400"><Eye size={15} /></Link>
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">لا توجد أوامر بيع</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
