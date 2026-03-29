import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, ArrowRight } from 'lucide-react';

interface WarehouseItem { id?: number; name: string; city: string; is_active: boolean; }

export default function WarehouseForm({ warehouse }: { warehouse?: WarehouseItem }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: warehouse?.name ?? '',
        city: warehouse?.city ?? '',
        is_active: warehouse?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        warehouse?.id ? put(`/warehouses/${warehouse.id}`) : post('/warehouses');
    };

    return (
        <AppLayout>
            <Head title={warehouse ? 'تعديل مستودع' : 'إضافة مستودع'} />
            <div className="max-w-lg space-y-4">
                <div className="flex items-center gap-3">
                    <a href="/warehouses" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                    <h1 className="text-xl font-bold text-white">{warehouse ? 'تعديل مستودع' : 'إضافة مستودع'}</h1>
                </div>
                <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">اسم المستودع *</label>
                        <input value={data.name} onChange={e => setData('name', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">المدينة</label>
                        <input value={data.city} onChange={e => setData('city', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
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
