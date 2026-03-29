import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Plus, Trash2, Save } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

interface Option    { id: number; name: string; }
interface Product   { id: number; name: string; sku: string; cost_price: number; }
interface Currency  { id: number; code: string; name: string; symbol: string; }
interface OrderItem { product_id: number; quantity: number; unit_cost: number; product: { name: string } }
interface Order     { id: number; number: string; supplier_id: number; warehouse_id: number; items: OrderItem[]; total: number; }

export default function PurchaseInvoiceForm({ order, suppliers, warehouses, products, currencies }: {
    order?: Order; suppliers: Option[]; warehouses: Option[];
    products: Product[]; currencies: Currency[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id:             order ? String(order.supplier_id) : '',
        warehouse_id:            order ? String(order.warehouse_id) : '',
        order_id:                order ? String(order.id) : '',
        currency_id:             '',
        supplier_invoice_number: '',
        date:                    new Date().toISOString().split('T')[0],
        due_date:                '',
        notes:                   '',
        items: order
            ? order.items.map(i => ({ product_id: String(i.product_id), quantity: i.quantity, unit_cost: i.unit_cost }))
            : [{ product_id: '', quantity: 1, unit_cost: 0 }] as any[],
    });

    const addItem    = () => setData('items', [...data.items, { product_id: '', quantity: 1, unit_cost: 0 }]);
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

    const total = data.items.reduce((s: number, i: any) => s + ((+i.quantity || 0) * (+i.unit_cost || 0)), 0);
    const selectedCurrency = currencies.find(c => c.id === +data.currency_id);

    return (
        <AppLayout>
            <Head title="فاتورة شراء جديدة" />
            <div className="max-w-4xl space-y-4">
                <div className="flex items-center gap-3">
                    <Link href="/purchase-invoices" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></Link>
                    <h1 className="text-xl font-bold text-white">
                        {order ? `فاتورة شراء من أمر ${order.number}` : 'فاتورة شراء جديدة'}
                    </h1>
                </div>

                <form onSubmit={e => { e.preventDefault(); post('/purchase-invoices'); }} className="space-y-4">
                    {/* Header */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">المورد *</label>
                            <select value={data.supplier_id} onChange={e => setData('supplier_id', e.target.value)}
                                disabled={!!order}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60">
                                <option value="">اختر مورد...</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplier_id && <p className="text-red-400 text-xs mt-1">{errors.supplier_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">المستودع *</label>
                            <select value={data.warehouse_id} onChange={e => setData('warehouse_id', e.target.value)}
                                disabled={!!order}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60">
                                <option value="">اختر مستودع...</option>
                                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">تاريخ الفاتورة *</label>
                            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">تاريخ الاستحقاق</label>
                            <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">العملة</label>
                            <select value={data.currency_id} onChange={e => setData('currency_id', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                <option value="">عملة الشركة الافتراضية</option>
                                {currencies.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">رقم فاتورة المورد</label>
                            <input value={data.supplier_invoice_number}
                                onChange={e => setData('supplier_invoice_number', e.target.value)}
                                placeholder="اختياري"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white font-medium">الأصناف</h2>
                            {!order && (
                                <button type="button" onClick={addItem}
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                                    <Plus size={14} /> إضافة صنف
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-xs text-slate-400 px-1">
                            <div className="col-span-5">المنتج</div>
                            <div className="col-span-3">الكمية</div>
                            <div className="col-span-3">سعر الوحدة {selectedCurrency ? `(${selectedCurrency.symbol})` : ''}</div>
                            <div className="col-span-1"></div>
                        </div>
                        {data.items.map((item: any, i: number) => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-5">
                                    <select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}
                                        disabled={!!order}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60">
                                        <option value="">اختر منتج...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <input type="number" value={item.quantity} min="0.001" step="0.001"
                                        onChange={e => updateItem(i, 'quantity', +e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-3">
                                    <input type="number" value={item.unit_cost} min="0" step="0.01"
                                        onChange={e => updateItem(i, 'unit_cost', +e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    {!order && data.items.length > 1 && (
                                        <button type="button" onClick={() => removeItem(i)} className="text-slate-500 hover:text-red-400">
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end pt-3 border-t border-slate-800">
                            <span className="text-white font-semibold">
                                الإجمالي: {selectedCurrency?.symbol ?? ''} {total.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm transition-colors">
                        <Save size={16} /> {processing ? 'جارٍ الحفظ...' : 'إنشاء الفاتورة'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
