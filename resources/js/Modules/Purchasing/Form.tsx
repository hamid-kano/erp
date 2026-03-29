import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, ArrowRight, Plus, Trash2 } from 'lucide-react';

interface Option { id: number; name: string; }
interface Product extends Option { sku: string; cost_price: number; }

export default function PurchasingForm({ suppliers, warehouses, products }: {
    suppliers: Option[]; warehouses: Option[]; products: Product[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        warehouse_id: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [{ product_id: '', quantity: 1, unit_cost: 0 }] as any[],
    });

    const addItem = () => setData('items', [...data.items, { product_id: '', quantity: 1, unit_cost: 0 }]);
    const removeItem = (i: number) => setData('items', data.items.filter((_: any, idx: number) => idx !== i));
    const updateItem = (i: number, key: string, val: any) => {
        const items = [...data.items];
        items[i] = { ...items[i], [key]: val };
        if (key === 'product_id') {
            const p = products.find(p => p.id === +val);
            if (p) items[i].unit_cost = p.cost_price;
        }
        setData('items', items);
    };

    const total = data.items.reduce((s: number, i: any) => s + (i.quantity * i.unit_cost), 0);

    return (
        <AppLayout>
            <Head title="أمر شراء جديد" />
            <div className="max-w-4xl space-y-4">
                <div className="flex items-center gap-3">
                    <a href="/purchase-orders" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                    <h1 className="text-xl font-bold text-white">أمر شراء جديد</h1>
                </div>
                <form onSubmit={e => { e.preventDefault(); post('/purchase-orders'); }} className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-2 gap-4">
                        {[
                            { label: 'المورد *', key: 'supplier_id', options: suppliers },
                            { label: 'المستودع *', key: 'warehouse_id', options: warehouses },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-sm text-slate-300 mb-1">{f.label}</label>
                                <select value={(data as any)[f.key]} onChange={e => setData(f.key as any, e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                    <option value="">اختر...</option>
                                    {f.options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">التاريخ *</label>
                            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white font-medium">الأصناف</h2>
                            <button type="button" onClick={addItem} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                                <Plus size={14} /> إضافة صنف
                            </button>
                        </div>
                        {data.items.map((item: any, i: number) => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-5">
                                    <select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">اختر منتج...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <input type="number" placeholder="الكمية" value={item.quantity} min="0.001" step="0.001"
                                        onChange={e => updateItem(i, 'quantity', +e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-3">
                                    <input type="number" placeholder="سعر الوحدة" value={item.unit_cost} min="0" step="0.01"
                                        onChange={e => updateItem(i, 'unit_cost', +e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    {data.items.length > 1 && (
                                        <button type="button" onClick={() => removeItem(i)} className="text-slate-500 hover:text-red-400">
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end pt-3 border-t border-slate-800">
                            <span className="text-white font-semibold">الإجمالي: {total.toLocaleString()} ر.س</span>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm transition-colors">
                        <Save size={16} /> {processing ? 'جارٍ الحفظ...' : 'إنشاء أمر الشراء'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
