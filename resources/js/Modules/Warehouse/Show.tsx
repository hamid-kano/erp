import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, ArrowLeftRight, Package, MapPin, Pencil } from 'lucide-react';
import { useState } from 'react';

interface StockItem  { id: number; name: string; sku: string; quantity: number; unit: string; }
interface Location   { id: number; code: string; zone: string; shelf: string; }
interface WareItem   { id: number; name: string; }
interface WarehouseItem {
    id: number; name: string; city: string; is_active: boolean;
    locations: Location[];
}

function TransferModal({ warehouseId, stock, warehouses, onClose }: {
    warehouseId: number;
    stock: StockItem[];
    warehouses: WareItem[];
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id:        '',
        from_warehouse_id: String(warehouseId),
        to_warehouse_id:   '',
        quantity:          '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/warehouses/transfer', {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <ArrowLeftRight size={18} className="text-blue-400" /> نقل مخزون
                </h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">المنتج *</label>
                        <select value={data.product_id} onChange={e => setData('product_id', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                            <option value="">اختر منتج...</option>
                            {stock.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} — متاح: {s.quantity} {s.unit}
                                </option>
                            ))}
                        </select>
                        {errors.product_id && <p className="text-red-400 text-xs mt-1">{errors.product_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">المستودع الهدف *</label>
                        <select value={data.to_warehouse_id} onChange={e => setData('to_warehouse_id', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                            <option value="">اختر مستودع...</option>
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        {errors.to_warehouse_id && <p className="text-red-400 text-xs mt-1">{errors.to_warehouse_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">الكمية *</label>
                        <input type="number" value={data.quantity} min="0.001" step="0.001"
                            onChange={e => setData('quantity', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm transition-colors">
                            {processing ? 'جارٍ النقل...' : 'نقل المخزون'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm transition-colors">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function WarehouseShow({ warehouse, stock, warehouses }: {
    warehouse: WarehouseItem;
    stock: StockItem[];
    warehouses: WareItem[];
}) {
    const [showTransfer, setShowTransfer] = useState(false);

    return (
        <AppLayout>
            <Head title={warehouse.name} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/warehouses" className="text-slate-400 hover:text-white">
                            <ArrowRight size={18} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">{warehouse.name}</h1>
                        {warehouse.city && (
                            <span className="text-slate-400 text-sm">{warehouse.city}</span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${warehouse.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                            {warehouse.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/warehouses/${warehouse.id}/edit`}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors">
                            <Pencil size={14} /> تعديل
                        </Link>
                        {stock.length > 0 && warehouses.length > 0 && (
                            <button onClick={() => setShowTransfer(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">
                                <ArrowLeftRight size={14} /> نقل مخزون
                            </button>
                        )}
                    </div>
                </div>
                <Flash />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* المخزون */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                            <Package size={16} className="text-blue-400" />
                            <h2 className="text-white font-medium text-sm">
                                المخزون
                                <span className="text-slate-500 mr-1">({stock.length} منتج)</span>
                            </h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-800">
                                <tr className="text-slate-400">
                                    <th className="text-right px-4 py-2">المنتج</th>
                                    <th className="text-right px-4 py-2">الكمية</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stock.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-2.5">
                                            <p className="text-white">{s.name}</p>
                                            {s.sku && <p className="text-slate-500 font-mono text-xs">{s.sku}</p>}
                                        </td>
                                        <td className="px-4 py-2.5 text-white font-medium">
                                            {s.quantity.toLocaleString()} {s.unit}
                                        </td>
                                    </tr>
                                ))}
                                {stock.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                                            لا يوجد مخزون في هذا المستودع
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* المواقع */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                            <MapPin size={16} className="text-green-400" />
                            <h2 className="text-white font-medium text-sm">
                                المواقع
                                <span className="text-slate-500 mr-1">({warehouse.locations.length})</span>
                            </h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-800">
                                <tr className="text-slate-400">
                                    <th className="text-right px-4 py-2">الكود</th>
                                    <th className="text-right px-4 py-2">المنطقة</th>
                                    <th className="text-right px-4 py-2">الرف</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {warehouse.locations.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-2.5 text-blue-400 font-mono text-xs">{l.code}</td>
                                        <td className="px-4 py-2.5 text-slate-300">{l.zone || '-'}</td>
                                        <td className="px-4 py-2.5 text-slate-300">{l.shelf || '-'}</td>
                                    </tr>
                                ))}
                                {warehouse.locations.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                            لا توجد مواقع مضافة
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showTransfer && (
                <TransferModal
                    warehouseId={warehouse.id}
                    stock={stock}
                    warehouses={warehouses}
                    onClose={() => setShowTransfer(false)}
                />
            )}
        </AppLayout>
    );
}
