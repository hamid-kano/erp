import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Option    { id: number; name: string; }
interface Product   { id: number; name: string; sku: string; sell_price: number; }
interface Currency  { id: number; code: string; name: string; symbol: string; }
interface OrderItem { product_id: number; quantity: number; unit_price: number; product: { name: string } }
interface Order     { id: number; number: string; customer_id: number; warehouse_id: number; items: OrderItem[]; }

export default function SalesInvoiceForm({ order, customers, warehouses, products, currencies }: {
    order?: Order; customers: Option[]; warehouses: Option[];
    products: Product[]; currencies: Currency[];
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        customer_id:  order ? String(order.customer_id) : '',
        warehouse_id: order ? String(order.warehouse_id) : '',
        order_id:     order ? String(order.id) : '',
        currency_id:  '',
        date:         new Date().toISOString().split('T')[0],
        due_date:     '',
        notes:        '',
        items: order
            ? order.items.map(i => ({ product_id: String(i.product_id), quantity: i.quantity, unit_price: i.unit_price }))
            : [{ product_id: '', quantity: 1, unit_price: 0 }] as any[],
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

    const total            = data.items.reduce((s: number, i: any) => s + ((+i.quantity || 0) * (+i.unit_price || 0)), 0);
    const selectedCurrency = currencies.find(c => c.id === +data.currency_id);

    return (
        <AppLayout>
            <Head title={order ? `فاتورة من أمر ${order.number}` : 'فاتورة مبيعات جديدة'} />
            <div className="max-w-4xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.sales') }, { label: t('nav.salesInvoices'), href: '/sales-invoices' }, { label: t('common.create') }]}
                    title={order ? `فاتورة من أمر ${order.number}` : 'فاتورة مبيعات جديدة'}
                />
                <form onSubmit={e => { e.preventDefault(); post('/sales-invoices'); }} className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('crm.customers')} *</label>
                                <Select value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} disabled={!!order} error={!!errors.customer_id}>
                                    <option value="">—</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>{t('nav.warehouses')} *</label>
                                <Select value={data.warehouse_id} onChange={e => setData('warehouse_id', e.target.value)} disabled={!!order}>
                                    <option value="">—</option>
                                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                                </Select>
                            </div>
                            <InputField label="تاريخ الفاتورة *" type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                            <InputField label="تاريخ الاستحقاق" type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} />
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>العملة</label>
                                <Select value={data.currency_id} onChange={e => setData('currency_id', e.target.value)}>
                                    <option value="">عملة الشركة الافتراضية</option>
                                    {currencies.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                                </Select>
                            </div>
                            <InputField label={t('accounting.description')} value={data.notes} onChange={e => setData('notes', e.target.value)} />
                        </div>
                    </Card>

                    <Card title={t('inventory.items')} action={
                        !order && (
                            <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-primary)' }}>
                                <Plus size={14} /> إضافة صنف
                            </button>
                        )
                    }>
                        <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-2 text-xs px-1" style={{ color: 'var(--color-text-muted)' }}>
                                <div className="col-span-5">{t('inventory.itemName')}</div>
                                <div className="col-span-3">{t('payments.amount')}</div>
                                <div className="col-span-3">{t('inventory.sellPrice')} {selectedCurrency ? `(${selectedCurrency.symbol})` : ''}</div>
                                <div className="col-span-1"></div>
                            </div>
                            {data.items.map((item: any, i: number) => (
                                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5">
                                        <Select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)} disabled={!!order}>
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
                                        {!order && data.items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(i)} style={{ color: 'var(--color-text-muted)' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <span className="font-semibold" style={{ color: 'var(--color-text-strong)' }}>
                                    {t('accounting.balance')}: {selectedCurrency?.symbol ?? ''} {total.toLocaleString()}
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
