import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowRight } from 'lucide-react';

interface Customer {
    id?: number; name: string; phone: string | null;
    email: string | null; address: string | null;
    credit_limit: number; is_active: boolean;
}

export default function CustomerForm({ customer }: { customer?: Customer }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name:         customer?.name ?? '',
        phone:        customer?.phone ?? '',
        email:        customer?.email ?? '',
        address:      customer?.address ?? '',
        credit_limit: customer?.credit_limit ?? 0,
        is_active:    customer?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        customer?.id ? put(`/customers/${customer.id}`) : post('/customers');
    };

    return (
        <AppLayout>
            <Head title={customer ? 'تعديل عميل' : 'عميل جديد'} />
            <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <Link href="/customers" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></Link>
                    <h1 className="text-xl font-bold text-white">{customer ? 'تعديل عميل' : 'عميل جديد'}</h1>
                </div>
                <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">الاسم *</label>
                        <input value={data.name} onChange={e => setData('name', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">الهاتف</label>
                            <input value={data.phone} onChange={e => setData('phone', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">البريد الإلكتروني</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">العنوان</label>
                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">حد الائتمان</label>
                        <input type="number" value={data.credit_limit} min={0} step="0.01"
                            onChange={e => setData('credit_limit', +e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                        <label htmlFor="is_active" className="text-sm text-slate-300 cursor-pointer">نشط</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            <Save size={16} /> {processing ? 'جارٍ الحفظ...' : 'حفظ'}
                        </button>
                        <Link href="/customers" className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            إلغاء
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
