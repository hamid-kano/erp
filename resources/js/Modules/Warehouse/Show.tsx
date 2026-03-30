import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, Badge, DataTableCard } from '@/Core/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftRight, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface StockItem { id: number; name: string; sku: string; quantity: number; unit: string; }
interface WareItem  { id: number; name: string; }
interface WarehouseItem { id: number; name: string; city: string; is_active: boolean; }

const inputCls = 'w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500';
const labelCls = 'block text-sm text-slate-300 mb-1';

function TransferModal({ warehouseId, stock, warehouses, onClose }: {
    warehouseId: number; stock: StockItem[]; warehouses: WareItem[]; onClose: () => void;
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '', from_warehouse_id: String(warehouseId), to_warehouse_id: '', quantity: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/warehouses/transfer', { onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <ArrowLeftRight size={18} className="text-blue-400" /> {t('warehouse.transfer')}
                </h2>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className={labelCls}>{t('inventory.items')} *</label>
                        <select value={data.product_id} onChange={e => setData('product_id', e.target.value)} className={inputCls}>
                            <option value="">—</option>
                            {stock.map(s => (
                                <option key={s.id} value={s.id}>{s.name} — {s.quantity} {s.unit}</option>
                            ))}
                        </select>
                        {errors.product_id && <p className="text-red-400 text-xs mt-1">{errors.product_id}</p>}
                    </div>
                    <div>
                        <label className={labelCls}>{t('warehouse.to')} *</label>
                        <select value={data.to_warehouse_id} onChange={e => setData('to_warehouse_id', e.target.value)} className={inputCls}>
                            <option value="">—</option>
                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                        {errors.to_warehouse_id && <p className="text-red-400 text-xs mt-1">{errors.to_warehouse_id}</p>}
                    </div>
                    <div>
                        <label className={labelCls}>{t('payments.amount')} *</label>
                        <input type="number" value={data.quantity} min="0.001" step="0.001"
                            onChange={e => setData('quantity', e.target.value)} className={inputCls} />
                        {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm transition-colors">
                            {processing ? t('common.saving') : t('warehouse.transfer')}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm transition-colors">
                            {t('common.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function WarehouseShow({ warehouse, stock, warehouses }: {
    warehouse: WarehouseItem; stock: StockItem[]; warehouses: WareItem[];
}) {
    const { t } = useTranslation();
    const [showTransfer, setShowTransfer] = useState(false);

    const columns = [
        { key: 'name', label: t('inventory.itemName'), render: (_: any, row: StockItem) => (
            <div>
                <p className="text-white">{row.name}</p>
                {row.sku && <p className="text-slate-500 font-mono text-xs">{row.sku}</p>}
            </div>
        )},
        { key: 'quantity', label: t('payments.amount'),
            render: (v: number, row: StockItem) => <span className="text-white font-medium">{v.toLocaleString()} {row.unit}</span>
        },
    ];

    return (
        <AppLayout>
            <Head title={warehouse.name} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.warehouses'), href: '/warehouses' }, { label: warehouse.name }]}
                    title={warehouse.name}
                    subtitle={warehouse.city || undefined}
                    actions={
                        <div className="flex gap-2">
                            <Link href={`/warehouses/${warehouse.id}/edit`}
                                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors">
                                <Pencil size={14} /> {t('common.edit')}
                            </Link>
                            {stock.length > 0 && warehouses.length > 0 && (
                                <button onClick={() => setShowTransfer(true)}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">
                                    <ArrowLeftRight size={14} /> {t('warehouse.transfer')}
                                </button>
                            )}
                        </div>
                    }
                />
                <Flash />
                <DataTableCard
                    title={t('inventory.items')}
                    subtitle={`${stock.length} ${t('inventory.items')}`}
                    columns={columns}
                    data={stock}
                    emptyText={t('common.noData')}
                />
            </div>
            {showTransfer && (
                <TransferModal warehouseId={warehouse.id} stock={stock} warehouses={warehouses} onClose={() => setShowTransfer(false)} />
            )}
        </AppLayout>
    );
}
