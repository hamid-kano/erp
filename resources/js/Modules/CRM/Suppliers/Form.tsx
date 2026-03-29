import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, ArrowRight } from 'lucide-react';

interface Supplier {
    id?: number; name: string; phone: string; email: string;
    address: string; payment_terms: number; is_active: boolean;
}

export default function SupplierForm({ supplier }: { supplier?: Supplier }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: supplier?.name ?? '',
        phone: supplier?.phone ?? '',
        email: supplier?.email ?? '',
        address: supplier?.address ?? '',
        payment_terms: supplier?.payment_terms ?? 30,
        is_active: supplier?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        supplier?.id ? put(`/suppliers/${supplier.id}`) : post('/suppliers');
    };

    return (
        <AppLayout>
            <Head title={supplier ? 'تعديل مورد' : 'إضافة مورد'} />
            <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <a href="/suppliers" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                    <h1 className="text-xl font-bold text-white">{supplier ? 'تعديل مورد' : 'إضافة مورد'}</h1>
                </div>
                <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    {[
                        { label: 'الاسم *', key: 'name', type: 'text' },
                        { label: 'الهاتف', key: 'phone', type: 'text' },
                        { label: 'البريد الإلكتروني', key: 'email', type: 'email' },
                        { label: 'العنوان', key: 'address', type: 'text' },
                        { label: 'شروط الدفع (أيام)', key: 'payment_terms', type: 'number' },
                    ].map(field => (
                        <div key={field.key}>
                            <label className="block text-sm text-slate-300 mb-1">{field.label}</label>
                            <input type={field.type} value={(data as any)[field.key]}
                                onChange={e => setData(field.key as any, field.type === 'number' ? +e.target.value : e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                            {(errors as any)[field.key] && <p className="text-red-400 text-xs mt-1">{(errors as any)[field.key]}</p>}
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                        <label htmlFor="is_active" className="text-sm text-slate-300">نشط</label>
                    </div>
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Save size={16} /> {processing ? 'جارٍ الحفظ...' : 'حفظ'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
