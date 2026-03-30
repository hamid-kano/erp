import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, PrimaryButton } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Order {
    id: number; number: string; date: string;
    status: string; total: number;
    supplier: { name: string };
}

const statusVariant: Record<string, any> = {
    draft: 'default', confirmed: 'primary', received: 'success', cancelled: 'danger',
};
const statusLabels: Record<string, string> = {
    draft: 'مسودة', confirmed: 'مؤكد', received: 'مستلم', cancelled: 'ملغي',
};

export default function PurchasingIndex({ orders, filters }: { orders: { data: Order[] }; filters: any }) {
    const { t } = useTranslation();

    const columns = [
        { key: 'number',   label: '#', render: (v: string) => <span className="font-mono text-xs" style={{ color: 'var(--color-primary)' }}>{v}</span> },
        { key: 'supplier', label: t('crm.suppliers'), render: (_: any, row: Order) => row.supplier?.name },
        { key: 'date',     label: t('accounting.date') },
        { key: 'total',    label: t('accounting.balance'), render: (v: number) => `${Number(v).toLocaleString()} ر.س` },
        { key: 'status',   label: t('common.status'),
            render: (v: string) => <Badge variant={statusVariant[v]} dot>{statusLabels[v]}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Order) => (
            <Link href={`/purchase-orders/${row.id}`} style={{ color: 'var(--color-text-muted)' }}><Eye size={15} /></Link>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('purchasing.orders')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.purchasing') }, { label: t('nav.purchaseOrders') }]}
                    title={t('purchasing.orders')}
                    actions={
                        <Link href="/purchase-orders/create">
                            <PrimaryButton><Plus size={16} /> {t('purchasing.newOrder')}</PrimaryButton>
                        </Link>
                    }
                />
                <Flash />
                <div className="flex gap-2 flex-wrap">
                    {['', 'draft', 'confirmed', 'received', 'cancelled'].map(s => (
                        <button key={s}
                            onClick={() => router.get('/purchase-orders', s ? { status: s } : {})}
                            className="px-3 py-1.5 rounded-lg text-xs transition-colors border"
                            style={{
                                background:  (filters.status === s || (!filters.status && !s)) ? 'var(--color-primary)' : 'var(--color-surface)',
                                color:       (filters.status === s || (!filters.status && !s)) ? '#fff' : 'var(--color-text)',
                                borderColor: 'var(--color-border)',
                            }}>
                            {s ? statusLabels[s] : t('common.all')}
                        </button>
                    ))}
                </div>
                <DataTableCard title={t('purchasing.orders')} columns={columns} data={orders.data} emptyText={t('common.noData')} />
            </div>
        </AppLayout>
    );
}
