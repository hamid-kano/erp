import { useForm, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Category { id: number; name: string; }
interface Unit { id: number; name: string; symbol: string; }
interface Product {
    id?: number;
    name: string;
    sku: string | null;
    category_id: number | null;
    unit_id: number | null;
    cost_price: number;
    sell_price: number;
    reorder_point: number;
    cost_method: string;
}

interface Props {
    product?: Product;
    categories: Category[];
    units: Unit[];
}

export default function ProductForm({ product, categories, units }: Props) {
    const isEdit = !!product;

    const { data, setData, post, put, processing, errors } = useForm({
        name:          product?.name ?? '',
        sku:           product?.sku ?? '',
        category_id:   product?.category_id ?? '',
        unit_id:       product?.unit_id ?? '',
        cost_price:    product?.cost_price ?? 0,
        sell_price:    product?.sell_price ?? 0,
        reorder_point: product?.reorder_point ?? 0,
        cost_method:   product?.cost_method ?? 'fifo',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? put(route('products.update', product!.id)) : post(route('products.store'));
    };

    return (
        <div className="p-6 max-w-2xl mx-auto" dir="rtl">
            <div className="flex items-center gap-3 mb-6">
                <Link href={route('products.index')} className="text-gray-500 hover:text-gray-700">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">{isEdit ? 'تعديل المنتج' : 'منتج جديد'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                {/* Name & SKU */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الكود (SKU)</label>
                        <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {/* Category & Unit */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                        <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- اختر --</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">وحدة القياس</label>
                        <select value={data.unit_id} onChange={(e) => setData('unit_id', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">-- اختر --</option>
                            {units.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                        </select>
                    </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">سعر التكلفة</label>
                        <input type="number" value={data.cost_price} onChange={(e) => setData('cost_price', Number(e.target.value))}
                            min={0} step="0.01"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">سعر البيع</label>
                        <input type="number" value={data.sell_price} onChange={(e) => setData('sell_price', Number(e.target.value))}
                            min={0} step="0.01"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                {/* Reorder & Cost Method */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">نقطة إعادة الطلب</label>
                        <input type="number" value={data.reorder_point} onChange={(e) => setData('reorder_point', Number(e.target.value))}
                            min={0} step="0.001"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">طريقة التكلفة</label>
                        <select value={data.cost_method} onChange={(e) => setData('cost_method', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="fifo">FIFO - الأول دخولاً أول خروجاً</option>
                            <option value="weighted">المتوسط المرجح</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {processing ? 'جاري الحفظ...' : isEdit ? 'تحديث' : 'حفظ'}
                    </button>
                    <Link href={route('products.index')}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        إلغاء
                    </Link>
                </div>
            </form>
        </div>
    );
}
