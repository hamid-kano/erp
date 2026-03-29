import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useState } from 'react';

interface Payment {
    id: number; amount: number; method: string;
    date: string; direction: 'in' | 'out'; notes: string;
}

const methodMap: Record<string, string> = {
    cash: 'نقدي', bank: 'تحويل بنكي', check: 'شيك', card: 'بطاقة',
};

export default function PaymentsIndex({ payments, filters }: { payments: { data: Payment[] }; filters: any }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        amount: '', method: 'cash', date: new Date().toISOString().split('T')[0],
        direction: 'in', notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/payments', { onSuccess: () => { reset(); setShowForm(false); } });
    };

    const totalIn  = payments.data.filter(p => p.direction === 'in').reduce((s, p) => s + +p.amount, 0);
    const totalOut = payments.data.filter(p => p.direction === 'out').reduce((s, p) => s + +p.amount, 0);

    return (
        <AppLayout>
            <Head title="المدفوعات" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">المدفوعات</h1>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> تسجيل دفعة
                    </button>
                </div>
                <Flash />
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                        <ArrowDownCircle size={20} className="text-green-400" />
                        <div>
                            <p className="text-slate-400 text-xs">إجمالي الوارد</p>
                            <p className="text-green-400 font-bold">{totalIn.toLocaleString()} ر.س</p>
                        </div>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                        <ArrowUpCircle size={20} className="text-red-400" />
                        <div>
                            <p className="text-slate-400 text-xs">إجمالي الصادر</p>
                            <p className="text-red-400 font-bold">{totalOut.toLocaleString()} ر.س</p>
                        </div>
                    </div>
                </div>

                {showForm && (
                    <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">المبلغ *</label>
                            <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} min="0.01" step="0.01"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">طريقة الدفع</label>
                            <select value={data.method} onChange={e => setData('method', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                {Object.entries(methodMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">التاريخ</label>
                            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">الاتجاه</label>
                            <select value={data.direction} onChange={e => setData('direction', e.target.value as any)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                <option value="in">وارد (قبض)</option>
                                <option value="out">صادر (دفع)</option>
                            </select>
                        </div>
                        <div className="col-span-2 flex gap-2">
                            <button type="submit" disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                                {processing ? 'جارٍ الحفظ...' : 'حفظ'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-sm">إلغاء</button>
                        </div>
                    </form>
                )}

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">التاريخ</th>
                                <th className="text-right px-4 py-3">المبلغ</th>
                                <th className="text-right px-4 py-3">الطريقة</th>
                                <th className="text-right px-4 py-3">الاتجاه</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {payments.data.map(p => (
                                <tr key={p.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-slate-300">{p.date}</td>
                                    <td className="px-4 py-3 text-white font-medium">{Number(p.amount).toLocaleString()} ر.س</td>
                                    <td className="px-4 py-3 text-slate-300">{methodMap[p.method] || p.method}</td>
                                    <td className="px-4 py-3">
                                        <span className={`flex items-center gap-1 text-xs w-fit px-2 py-0.5 rounded-full ${p.direction === 'in' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {p.direction === 'in' ? <ArrowDownCircle size={11} /> : <ArrowUpCircle size={11} />}
                                            {p.direction === 'in' ? 'وارد' : 'صادر'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => { if (confirm('حذف الدفعة؟')) router.delete(`/payments/${p.id}`); }}
                                            className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
                                    </td>
                                </tr>
                            ))}
                            {payments.data.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">لا توجد مدفوعات</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
