import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, PrimaryButton, Select } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Invoice {
    id: number; number: string; date: string; due_date: string;
    status: string; total: number; paid: number;
    supplier: { name: string };
    currency: { code: string; symbol: string } | null;
}

const statusVariant: Record<string, any> = {
    draft: 'default', posted: 'primary', partial: 'warning', paid: 'success', cancelled: 'danger',
};
const statusLabels: Record<string, string> = {
    draft: 'مسودة', posted: 'مرحّلة', partial: 'جزئي', paid: 'مدفوعة', cancelled: 'ملغية',
};

export default function PurchaseInvoicesIndex({ invoices, filters, suppliers }: {
    invoices: { data: Invoice[] }; filters: any; suppliers: { id: number; name: string }[];
}) {
    const { t } = useTranslation();

    const columns = [
        { key: 'number',   label: '#', render: (v: string) => <span className="font-mono text-xs" style={{ color: 'var(--color-primary)' }}>{v}</span> },
        { key: 'supplier', label: t('crm.suppliers'), render: (_: any, row: Invoice) => row.supplier?.name },
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
            <Link href={`/purchase-invoices/${row.id}`} style={{ color: 'var(--color-text-muted)' }}><Eye size={15} /></Link>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('purchasing.invoices')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.purchasing') }, { label: t('nav.purchaseInvoices') }]}
                    title={t('purchasing.invoices')}
                    actions={
                        <Link href="/purchase-invoices/create">
                            <PrimaryButton><Plus size={16} /> فاتورة شراء جديدة</PrimaryButton>
                        </Link>
                    }
                />
                <Flash />
                <div className="flex gap-3">
                    <Select value={filters.status ?? ''} className="w-44"
                        onChange={e => router.get('/purchase-invoices', { ...filters, status: e.target.value })}>
                        <option value="">{t('common.all')}</option>
                        {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </Select>
                    <Select value={filters.supplier_id ?? ''} className="w-48"
                        onChange={e => router.get('/purchase-invoices', { ...filters, supplier_id: e.target.value })}>
                        <option value="">{t('common.all')} {t('crm.suppliers')}</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                </div>
                <DataTableCard title={t('purchasing.invoices')} columns={columns} data={invoices.data} emptyText={t('common.noData')} />
            </div>
        </AppLayout>
    );
}
