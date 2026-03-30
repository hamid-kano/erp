import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, PrimaryButton } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Order {
    id: number; number: string; date: string;
    status: string; total: number;
    customer: { name: string };
}

const statusVariant: Record<string, any> = {
    draft:     'default',
    confirmed: 'primary',
    shipped:   'info',
    completed: 'success',
    cancelled: 'danger',
};

export default function SalesIndex({ orders, filters }: { orders: { data: Order[] }; filters: any }) {
    const { t } = useTranslation();

    const columns = [
        { key: 'number',   label: '#',              render: (v: string) => <span className="font-mono text-xs" style={{ color: 'var(--color-primary)' }}>{v}</span> },
        { key: 'customer', label: t('crm.customers'), render: (_: any, row: Order) => row.customer?.name },
        { key: 'date',     label: t('accounting.date') },
        { key: 'total',    label: t('accounting.balance'), render: (v: number) => `${Number(v).toLocaleString()} ر.س` },
        { key: 'status',   label: t('common.status'),
            render: (v: string) => <Badge variant={statusVariant[v]} dot>{t(`sales.statuses.${v}`)}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Order) => (
            <Link href={`/sales-orders/${row.id}`} style={{ color: 'var(--color-text-muted)' }}><Eye size={15} /></Link>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('sales.orders')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.sales') }, { label: t('nav.salesOrders') }]}
                    title={t('sales.orders')}
                    actions={
                        <Link href="/sales-orders/create">
                            <PrimaryButton><Plus size={16} /> {t('sales.newOrder')}</PrimaryButton>
                        </Link>
                    }
                />
                <Flash />
                <div className="flex gap-2 flex-wrap">
                    {['', 'draft', 'confirmed', 'shipped', 'completed', 'cancelled'].map(s => (
                        <button key={s}
                            onClick={() => router.get('/sales-orders', s ? { status: s } : {})}
                            className="px-3 py-1.5 rounded-lg text-xs transition-colors border"
                            style={{
                                background:  (filters.status === s || (!filters.status && !s)) ? 'var(--color-primary)' : 'var(--color-surface)',
                                color:       (filters.status === s || (!filters.status && !s)) ? '#fff' : 'var(--color-text)',
                                borderColor: 'var(--color-border)',
                            }}>
                            {s ? t(`sales.statuses.${s}`) : t('common.all')}
                        </button>
                    ))}
                </div>
                <DataTableCard title={t('sales.orders')} columns={columns} data={orders.data} emptyText={t('common.noData')} />
            </div>
        </AppLayout>
    );
}
