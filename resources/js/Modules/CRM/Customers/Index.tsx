import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number; name: string; phone: string | null;
    email: string | null; credit_limit: number; is_active: boolean;
}

export default function CustomersIndex({ customers, filters }: {
    customers: { data: Customer[]; total: number; last_page: number; current_page: number };
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <AppLayout>
            <Head title="العملاء" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">العملاء</h1>
                    <Link href="/customers/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> عميل جديد
                    </Link>
                </div>
                <Flash />
                <form onSubmit={e => { e.preventDefault(); router.get('/customers', { search }, { preserveState: true }); }} className="relative">
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-blue-500" />
                </form>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">الاسم</th>
                                <th className="text-right px-4 py-3">الهاتف</th>
                                <th className="text-right px-4 py-3">البريد</th>
                                <th className="text-right px-4 py-3">حد الائتمان</th>
                                <th className="text-right px-4 py-3">الحالة</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {customers.data.map(c => (
                                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                                    <td className="px-4 py-3 text-slate-300">{c.phone || '-'}</td>
                                    <td className="px-4 py-3 text-slate-300">{c.email || '-'}</td>
                                    <td className="px-4 py-3 text-slate-300">{Number(c.credit_limit).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${c.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {c.is_active ? 'نشط' : 'موقوف'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Link href={`/customers/${c.id}/edit`} className="text-slate-400 hover:text-blue-400"><Pencil size={15} /></Link>
                                            <button onClick={() => { if (confirm('حذف العميل؟')) router.delete(`/customers/${c.id}`); }}
                                                className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {customers.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">لا يوجد عملاء</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
