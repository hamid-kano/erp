import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Badge, DataTableCard, Modal, PrimaryButton, SecondaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftRight, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface StockItem { id: number; name: string; sku: string; quantity: number; unit: string; }
interface WareItem  { id: number; name: string; }
interface WarehouseItem { id: number; name: string; city: string; is_active: boolean; }

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
        <Modal show title={t('warehouse.transfer')} onClose={onClose}>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('inventory.items')} *</label>
                    <Select value={data.product_id} onChange={e => setData('product_id', e.target.value)} error={!!errors.product_id}>
                        <option value="">—</option>
                        {stock.map(s => (
                            <option key={s.id} value={s.id}>{s.name} — {s.quantity} {s.unit}</option>
                        ))}
                    </Select>
                    {errors.product_id && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.product_id}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">{t('warehouse.to')} *</label>
                    <Select value={data.to_warehouse_id} onChange={e => setData('to_warehouse_id', e.target.value)} error={!!errors.to_warehouse_id}>
                        <option value="">—</option>
                        {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </Select>
                    {errors.to_warehouse_id && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.to_warehouse_id}</p>}
                </div>
                <InputField label={`${t('payments.amount')} *`} type="number" value={data.quantity} min="0.001" step="0.001"
                    onChange={e => setData('quantity', e.target.value)} error={errors.quantity} />
                <div className="flex gap-2 pt-2">
                    <PrimaryButton type="submit" loading={processing} className="flex-1 justify-center">
                        {t('warehouse.transfer')}
                    </PrimaryButton>
                    <SecondaryButton type="button" onClick={onClose} className="flex-1 justify-center">
                        {t('common.cancel')}
                    </SecondaryButton>
                </div>
            </form>
        </Modal>
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
                <p style={{ color: 'var(--color-text-strong)' }}>{row.name}</p>
                {row.sku && <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.sku}</p>}
            </div>
        )},
        { key: 'quantity', label: t('payments.amount'),
            render: (v: number, row: StockItem) => (
                <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>
                    {v.toLocaleString()} {row.unit}
                </span>
            )
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
                            <Link href={`/warehouses/${warehouse.id}/edit`}>
                                <SecondaryButton><Pencil size={14} /> {t('common.edit')}</SecondaryButton>
                            </Link>
                            {stock.length > 0 && warehouses.length > 0 && (
                                <PrimaryButton onClick={() => setShowTransfer(true)}>
                                    <ArrowLeftRight size={14} /> {t('warehouse.transfer')}
                                </PrimaryButton>
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
