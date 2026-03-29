import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowRight } from 'lucide-react';

interface Category { id: number; name: string; }
interface Unit { id: number; name: string; symbol: string; }
interface Product {
    id?: number; name: string; sku: string | null;
    category_id: number | null; unit_id: number | null;
    cost_price: number; sell_price: number;
    reorder_point: number; cost_method: string; is_active: boolean;
}

export default function ProductForm({ product, categories, units }: {
    product?: Product; categories: Category[]; units: Unit[];
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        name:          product?.name ?? '',
        sku:           product?.sku ?? '',
        category_id:   product?.category_id ?? '',
        unit_id:       product?.unit_id ?? '',
        cost_price:    product?.cost_price ?? 0,
        sell_price:    product?.sell_price ?? 0,
        reorder_point: product?.reorder_point ?? 0,
        cost_method:   product?.cost_method ?? 'fifo',
        is_active:     product?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        product?.id ? put(`/products/${product.id}`) : post('/products');
    };

    const field = (label: string, key: keyof typeof data, type = 'text', extra?: object) => (
        <div>
            <label className="block text-sm text-slate-300 mb-1">{label}</label>
            <input type={type} value={data[key] as any}
                onChange={e => setData(key, type === 'number' ? +e.target.value : e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                {...extra} />
            {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
        </div>
    );

    return (
        <AppLayout>
            <Head title={product ? 'تعديل منتج' : 'منتج جديد'} />
            <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <Link href="/products" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></Link>
                    <h1 className="text-xl font-bold text-white">{product ? 'تعديل منتج' : 'منتج جديد'}</h1>
                </div>
                <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {field('اسم المنتج *', 'name')}
                        {field('الكود (SKU)', 'sku')}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">الفئة</label>
                            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                <option value="">-- اختر --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">وحدة القياس</label>
                            <select value={data.unit_id} onChange={e => setData('unit_id', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                <option value="">-- اختر --</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {field('سعر التكلفة', 'cost_price', 'number', { min: 0, step: '0.01' })}
                        {field('سعر البيع', 'sell_price', 'number', { min: 0, step: '0.01' })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {field('نقطة إعادة الطلب', 'reorder_point', 'number', { min: 0, step: '0.001' })}
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">طريقة التكلفة</label>
                            <select value={data.cost_method} onChange={e => setData('cost_method', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                <option value="fifo">FIFO - الأول دخولاً أول خروجاً</option>
                                <option value="weighted">المتوسط المرجح</option>
                            </select>
                        </div>
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
                        <Link href="/products" className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            إلغاء
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
