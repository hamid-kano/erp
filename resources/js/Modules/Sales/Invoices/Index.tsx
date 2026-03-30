import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, PrimaryButton, Select } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Invoice {
    id: number; number: string; date: string; due_date: string;
    status: string; total: number; paid: number;
    customer: { name: string };
    currency: { code: string; symbol: string } | null;
}

const statusVariant: Record<string, any> = {
    draft: 'default', issued: 'primary', partial: 'warning', paid: 'success', cancelled: 'danger',
};
const statusLabels: Record<string, string> = {
    draft: 'مسودة', issued: 'مُصدرة', partial: 'جزئي', paid: 'مدفوعة', cancelled: 'ملغية',
};

export default function SalesInvoicesIndex({ invoices, filters, customers }: {
    invoices: { data: Invoice[] }; filters: any; customers: { id: number; name: string }[];
}) {
    const { t } = useTranslation();

    const columns = [
        { key: 'number',   label: '#', render: (v: string) => <span className="font-mono text-xs" style={{ color: 'var(--color-primary)' }}>{v}</span> },
        { key: 'customer', label: t('crm.customers'), render: (_: any, row: Invoice) => row.customer?.name },
        { key: 'date',     label: t('accounting.date') },
        { key: 'due_date', label: 'الاستحقاق', render: (v: string) => v || '—' },
        { key: 'total',    label: t('accounting.balance'),
            render: (v: number, row: Invoice) => `${row.currency?.symbol ?? ''} ${Number(v).toLocaleString()}`
        },
        { key: 'paid',     label: 'المتبقي',
            render: (v: number, row: Invoice) => {
                const bal = row.total - v;
                return <span style={{ color: bal > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>{row.currency?.symbol} {Number(bal).toLocaleString()}</span>;
            }
        },
        { key: 'status',   label: t('common.status'),
            render: (v: string) => <Badge variant={statusVariant[v]} dot>{statusLabels[v]}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Invoice) => (
            <Link href={`/sales-invoices/${row.id}`} style={{ color: 'var(--color-text-muted)' }}><Eye size={15} /></Link>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('sales.invoices')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.sales') }, { label: t('nav.salesInvoices') }]}
                    title={t('sales.invoices')}
                    actions={
                        <Link href="/sales-invoices/create">
                            <PrimaryButton><Plus size={16} /> فاتورة جديدة</PrimaryButton>
                        </Link>
                    }
                />
                <Flash />
                <div className="flex gap-3">
                    <Select value={filters.status ?? ''} className="w-44"
                        onChange={e => router.get('/sales-invoices', { ...filters, status: e.target.value })}>
                        <option value="">{t('common.all')}</option>
                        {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </Select>
                    <Select value={filters.customer_id ?? ''} className="w-48"
                        onChange={e => router.get('/sales-invoices', { ...filters, customer_id: e.target.value })}>
                        <option value="">{t('common.all')} {t('crm.customers')}</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                </div>
                <DataTableCard title={t('sales.invoices')} columns={columns} data={invoices.data} emptyText={t('common.noData')} />
            </div>
        </AppLayout>
    );
}
