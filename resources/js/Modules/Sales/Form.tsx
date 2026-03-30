import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option   { id: number; name: string; }
interface Product  { id: number; name: string; sku: string; sell_price: number; }

export default function SalesForm({ customers, warehouses, products }: {
    customers: Option[]; warehouses: Option[]; products: Product[];
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing } = useForm({
        customer_id:  '',
        warehouse_id: '',
        date:         new Date().toISOString().split('T')[0],
        notes:        '',
        items:        [{ product_id: '', quantity: 1, unit_price: 0 }] as any[],
    });

    const addItem    = () => setData('items', [...data.items, { product_id: '', quantity: 1, unit_price: 0 }]);
    const removeItem = (i: number) => setData('items', data.items.filter((_: any, idx: number) => idx !== i));
    const updateItem = (i: number, key: string, val: any) => {
        const items = [...data.items];
        items[i] = { ...items[i], [key]: val };
        if (key === 'product_id') {
            const p = products.find(p => p.id === +val);
            if (p) items[i].unit_price = p.sell_price;
        }
        setData('items', items);
    };

    const total = data.items.reduce((s: number, i: any) => s + ((+i.quantity || 0) * (+i.unit_price || 0)), 0);

    return (
        <AppLayout>
            <Head title={t('sales.newOrder')} />
            <div className="max-w-4xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.sales') }, { label: t('nav.salesOrders'), href: '/sales-orders' }, { label: t('common.create') }]}
                    title={t('sales.newOrder')}
                />
                <form onSubmit={e => { e.preventDefault(); post('/sales-orders'); }} className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('crm.customers')} *</label>
                                <Select value={data.customer_id} onChange={e => setData('customer_id', e.target.value)}>
                                    <option value="">—</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                                <div className="col-span-3">{t('inventory.sellPrice')}</div>
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
                                        <InputField label="" type="number" value={item.unit_price} min="0" step="0.01"
                                            onChange={e => updateItem(i, 'unit_price', +e.target.value)} />
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
