import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option  { id: number; name: string; }
interface Product { id: number; name: string; sku: string; cost_price: number; }

export default function PurchasingForm({ suppliers, warehouses, products }: {
    suppliers: Option[]; warehouses: Option[]; products: Product[];
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing } = useForm({
        supplier_id:  '',
        warehouse_id: '',
        date:         new Date().toISOString().split('T')[0],
        notes:        '',
        items:        [{ product_id: '', quantity: 1, unit_cost: 0 }] as any[],
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

    return (
        <AppLayout>
            <Head title={t('purchasing.newOrder')} />
            <div className="max-w-4xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.purchasing') }, { label: t('nav.purchaseOrders'), href: '/purchase-orders' }, { label: t('common.create') }]}
                    title={t('purchasing.newOrder')}
                />
                <form onSubmit={e => { e.preventDefault(); post('/purchase-orders'); }} className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('crm.suppliers')} *</label>
                                <Select value={data.supplier_id} onChange={e => setData('supplier_id', e.target.value)}>
                                    <option value="">—</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('nav.warehouses')} *</label>
                                <Select value={data.warehouse_id} onChange={e => setData('warehouse_id', e.target.value)}>
                                    <option value="">—</option>
                                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </Select>
                            </div>
                            <InputField label={`${t('accounting.date')} *`} type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                            <InputField label={t('accounting.description')} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                        </div>
                    </Card>

                    <Card title={t('inventory.items')} action={
                        <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-primary)' }}>
                            <Plus size={14} /> إضافة صنف
                        </button>
                    }>
                        <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-2 text-xs px-1" style={{ color: 'var(--color-text-muted)' }}>
                                <div className="col-span-5">{t('inventory.itemName')}</div>
                                <div className="col-span-3">{t('payments.amount')}</div>
                                <div className="col-span-3">{t('inventory.costPrice')}</div>
                                <div className="col-span-1"></div>
                            </div>
                            {data.items.map((item: any, i: number) => (
                                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5">
                                        <Select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}>
                                            <option value="">—</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <InputField label="" type="number" value={item.quantity} min="0.001" step="0.001"
                                            onChange={e => updateItem(i, 'quantity', +e.target.value)} />
                                    </div>
                                    <div className="col-span-3">
                                        <InputField label="" type="number" value={item.unit_cost} min="0" step="0.01"
                                            onChange={e => updateItem(i, 'unit_cost', +e.target.value)} />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        {data.items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(i)} style={{ color: 'var(--color-text-muted)' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <span className="font-semibold" style={{ color: 'var(--color-text-strong)' }}>
                                    {t('accounting.balance')}: {total.toLocaleString()} ر.س
                                </span>
                            </div>
                        </div>
                    </Card>

                    <PrimaryButton type="submit" loading={processing}>
                        <Save size={15} /> {t('common.save')}
                    </PrimaryButton>
                </form>
            </div>
        </AppLayout>
    );
}
