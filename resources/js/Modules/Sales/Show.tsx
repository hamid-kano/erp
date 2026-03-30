import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, Badge, DataTableCard, PrimaryButton, DangerButton } from '@/Core/Components/UI';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Truck, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Order {
    id: number; number: string; date: string; status: string; total: number;
    customer: { name: string; phone: string };
    warehouse: { name: string };
    items: { id: number; quantity: number; unit_price: number; product: { name: string } }[];
    invoice?: { number: string; total: number; status: string };
}

const statusVariant: Record<string, any> = {
    draft: 'default', confirmed: 'primary', shipped: 'info', completed: 'success', cancelled: 'danger',
};

export default function SalesShow({ order }: { order: Order }) {
    const { t } = useTranslation();

    const columns = [
        { key: 'product', label: t('inventory.itemName'), render: (_: any, row: any) => row.product?.name },
        { key: 'quantity',   label: t('payments.amount'),      render: (v: number) => v.toLocaleString() },
        { key: 'unit_price', label: t('inventory.sellPrice'),  render: (v: number) => `${Number(v).toLocaleString()} ر.س` },
        { key: 'id',         label: t('accounting.balance'),   render: (_: any, row: any) => `${(row.quantity * row.unit_price).toLocaleString()} ر.س` },
    ];

    return (
        <AppLayout>
            <Head title={`${t('sales.orders')} ${order.number}`} />
            <div className="max-w-4xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.sales') }, { label: t('nav.salesOrders'), href: '/sales-orders' }, { label: order.number }]}
                    title={order.number}
                    actions={
                        <div className="flex gap-2">
                            {order.status === 'draft' && (
                                <PrimaryButton onClick={() => router.post(`/sales-orders/${order.id}/confirm`)}>
                                    <CheckCircle size={14} /> تأكيد
                                </PrimaryButton>
                            )}
                            {order.status === 'confirmed' && (
                                <PrimaryButton onClick={() => router.post(`/sales-orders/${order.id}/ship`)}>
                                    <Truck size={14} /> شحن وإصدار فاتورة
                                </PrimaryButton>
                            )}
                            {['draft', 'confirmed'].includes(order.status) && (
                                <DangerButton onClick={() => { if (confirm('إلغاء الطلب؟')) router.post(`/sales-orders/${order.id}/cancel`); }}>
                                    <XCircle size={14} /> إلغاء
                                </DangerButton>
                            )}
                        </div>
                    }
                />
                <Flash />

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: t('crm.customers'),   value: order.customer?.name },
                        { label: t('nav.warehouses'),  value: order.warehouse?.name },
                        { label: t('accounting.date'), value: order.date },
                    ].map(item => (
                        <Card key={item.label} bodyClassName="py-4">
                            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                            <p className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{item.value}</p>
                        </Card>
                    ))}
                </div>

                {order.invoice && (
                    <div className="px-4 py-3 rounded-xl border flex items-center justify-between"
                        style={{ background: 'rgba(99,102,241,0.05)', borderColor: 'var(--color-primary)' }}>
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>فاتورة: {order.invoice.number}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                {Number(order.invoice.total).toLocaleString()} ر.س
                            </p>
                        </div>
                        <Badge variant={order.invoice.status === 'paid' ? 'success' : 'warning'} dot>
                            {order.invoice.status === 'paid' ? 'مدفوعة' : 'معلقة'}
                        </Badge>
                    </div>
                )}

                <DataTableCard
                    title={t('inventory.items')}
                    columns={columns}
                    data={order.items}
                    footer={<span className="font-semibold" style={{ color: 'var(--color-text-strong)' }}>{t('accounting.balance')}: {Number(order.total).toLocaleString()} ر.س</span>}
                />
            </div>
        </AppLayout>
    );
}
