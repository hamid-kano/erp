import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';

interface Invoice {
    id: number; number: string; date: string; due_date: string;
    status: string; total: number; paid: number;
    customer: { name: string };
    currency: { code: string; symbol: string } | null;
}

const statusMap: Record<string, { label: string; color: string }> = {
    draft:     { label: 'مسودة',   color: 'bg-slate-700 text-slate-300' },
    issued:    { label: 'مُصدرة',  color: 'bg-blue-500/10 text-blue-400' },
    partial:   { label: 'جزئي',    color: 'bg-yellow-500/10 text-yellow-400' },
    paid:      { label: 'مدفوعة',  color: 'bg-green-500/10 text-green-400' },
    cancelled: { label: 'ملغية',   color: 'bg-red-500/10 text-red-400' },
};

export default function SalesInvoicesIndex({ invoices, filters, customers }: {
    invoices: { data: Invoice[] };
    filters: any;
    customers: { id: number; name: string }[];
}) {
    return (
        <AppLayout>
            <Head title="فواتير المبيعات" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">فواتير المبيعات</h1>
                    <Link href="/sales-invoices/create"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> فاتورة مبيعات جديدة
                    </Link>
                </div>
                <Flash />

                <div className="flex gap-3">
                    <select value={filters.status ?? ''} onChange={e => router.get('/sales-invoices', { ...filters, status: e.target.value })}
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">كل الحالات</option>
                        {Object.entries(statusMap).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select value={filters.customer_id ?? ''} onChange={e => router.get('/sales-invoices', { ...filters, customer_id: e.target.value })}
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">كل العملاء</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">الرقم</th>
                                <th className="text-right px-4 py-3">العميل</th>
                                <th className="text-right px-4 py-3">التاريخ</th>
                                <th className="text-right px-4 py-3">الاستحقاق</th>
                                <th className="text-right px-4 py-3">الإجمالي</th>
                                <th className="text-right px-4 py-3">المتبقي</th>
                                <th className="text-right px-4 py-3">الحالة</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {invoices.data.map(inv => (
                                <tr key={inv.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-blue-400 font-mono text-xs">{inv.number}</td>
                                    <td className="px-4 py-3 text-white">{inv.customer?.name}</td>
                                    <td className="px-4 py-3 text-slate-300">{inv.date}</td>
                                    <td className="px-4 py-3 text-slate-300">{inv.due_date || '-'}</td>
                                    <td className="px-4 py-3 text-white">
                                        {inv.currency?.symbol} {Number(inv.total).toLocaleString()}
                                    </td>
                                    <td className={`px-4 py-3 font-medium ${(inv.total - inv.paid) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {inv.currency?.symbol} {Number(inv.total - inv.paid).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusMap[inv.status]?.color}`}>
                                            {statusMap[inv.status]?.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link href={`/sales-invoices/${inv.id}`} className="text-slate-400 hover:text-blue-400">
                                            <Eye size={15} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {invoices.data.length === 0 && (
                                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">لا توجد فواتير</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
