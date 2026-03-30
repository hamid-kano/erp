import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, Badge, DataTableCard, PrimaryButton, DangerButton } from '@/Core/Components/UI';
import { Head, router } from '@inertiajs/react';
import { CheckCircle, Package, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Order {
    id: number; number: string; date: string; status: string; total: number; notes: string;
    supplier: { name: string };
    warehouse: { name: string };
    items: { id: number; quantity: number; unit_cost: number; product: { name: string } }[];
}

const statusVariant: Record<string, any> = {
    draft: 'default', confirmed: 'primary', received: 'success', cancelled: 'danger',
};
const statusLabels: Record<string, string> = {
    draft: 'مسودة', confirmed: 'مؤكد', received: 'مستلم', cancelled: 'ملغي',
};

export default function PurchasingShow({ order }: { order: Order }) {
    const { t } = useTranslation();

    const columns = [
        { key: 'product',   label: t('inventory.itemName'), render: (_: any, row: any) => row.product?.name },
        { key: 'quantity',  label: t('payments.amount'),    render: (v: number) => v.toLocaleString() },
        { key: 'unit_cost', label: t('inventory.costPrice'), render: (v: number) => `${Number(v).toLocaleString()} ر.س` },
        { key: 'id',        label: t('accounting.balance'),  render: (_: any, row: any) => `${(row.quantity * row.unit_cost).toLocaleString()} ر.س` },
    ];

    return (
        <AppLayout>
            <Head title={`${t('purchasing.orders')} ${order.number}`} />
            <div className="max-w-4xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.purchasing') }, { label: t('nav.purchaseOrders'), href: '/purchase-orders' }, { label: order.number }]}
                    title={order.number}
                    actions={
                        <div className="flex gap-2">
                            {order.status === 'draft' && (
                                <PrimaryButton onClick={() => router.post(`/purchase-orders/${order.id}/confirm`)}>
                                    <CheckCircle size={14} /> تأكيد
                                </PrimaryButton>
                            )}
                            {order.status === 'confirmed' && (
                                <PrimaryButton onClick={() => router.post(`/purchase-orders/${order.id}/receive`)}>
                                    <Package size={14} /> استلام البضاعة
                                </PrimaryButton>
                            )}
                            {['draft', 'confirmed'].includes(order.status) && (
                                <DangerButton onClick={() => { if (confirm('إلغاء الطلب؟')) router.post(`/purchase-orders/${order.id}/cancel`); }}>
                                    <XCircle size={14} /> إلغاء
                                </DangerButton>
                            )}
                        </div>
                    }
                />
                <Flash />

                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: t('crm.suppliers'),   value: order.supplier?.name },
                        { label: t('nav.warehouses'),  value: order.warehouse?.name },
                        { label: t('accounting.date'), value: order.date },
                    ].map(item => (
                        <Card key={item.label} bodyClassName="py-4">
                            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                            <p className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{item.value}</p>
                        </Card>
                    ))}
                </div>

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
