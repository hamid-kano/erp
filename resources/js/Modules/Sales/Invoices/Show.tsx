import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, Badge, DataTableCard } from '@/Core/Components/UI';
import { Head } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

interface Invoice {
    id: number; number: string; date: string; due_date: string;
    status: string; total: number; total_base: number; paid: number; cogs: number;
    notes: string | null; exchange_rate: number;
    customer: { name: string };
    currency: { code: string; symbol: string } | null;
    order: { number: string } | null;
    items: { id: number; quantity: number; unit_price: number; total: number; product: { name: string; sku: string } }[];
}

const statusVariant: Record<string, any> = {
    draft: 'default', issued: 'primary', partial: 'warning', paid: 'success', cancelled: 'danger',
};
const statusLabels: Record<string, string> = {
    draft: 'مسودة', issued: 'مُصدرة', partial: 'جزئي', paid: 'مدفوعة', cancelled: 'ملغية',
};

export default function SalesInvoiceShow({ invoice }: { invoice: Invoice }) {
    const { t } = useTranslation();
    const sym     = invoice.currency?.symbol ?? '';
    const balance = invoice.total - invoice.paid;
    const profit  = invoice.total_base - invoice.cogs;

    const columns = [
        { key: 'product',    label: t('inventory.itemName'), render: (_: any, row: any) => row.product?.name },
        { key: 'quantity',   label: t('payments.amount'),    render: (v: number) => v.toLocaleString() },
        { key: 'unit_price', label: t('inventory.sellPrice'), render: (v: number) => `${sym} ${Number(v).toLocaleString()}` },
        { key: 'total',      label: t('accounting.balance'),  render: (v: number) => `${sym} ${Number(v).toLocaleString()}` },
    ];

    return (
        <AppLayout>
            <Head title={`فاتورة ${invoice.number}`} />
            <div className="max-w-4xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.sales') }, { label: t('nav.salesInvoices'), href: '/sales-invoices' }, { label: invoice.number }]}
                    title={invoice.number}
                    actions={<Badge variant={statusVariant[invoice.status]}>{statusLabels[invoice.status]}</Badge>}
                />
                <Flash />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: t('crm.customers'),        value: invoice.customer?.name },
                        { label: 'تاريخ الفاتورة',          value: invoice.date },
                        { label: 'تاريخ الاستحقاق',         value: invoice.due_date || '—' },
                        { label: 'أمر البيع',                value: invoice.order?.number || 'مباشر' },
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
                    data={invoice.items}
                    footer={
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span>{t('accounting.balance')}</span>
                                <span className="font-bold" style={{ color: 'var(--color-text-strong)' }}>{sym} {Number(invoice.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>المدفوع</span>
                                <span style={{ color: 'var(--color-success)' }}>{sym} {Number(invoice.paid).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>المتبقي</span>
                                <span style={{ color: balance > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                    {sym} {Number(balance).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    }
                />

                {invoice.cogs > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        <Card bodyClassName="py-4">
                            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>تكلفة البضاعة (COGS)</p>
                            <p className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{Number(invoice.cogs).toLocaleString()}</p>
                        </Card>
                        <Card bodyClassName="py-4">
                            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>الإيراد (بالعملة الأساسية)</p>
                            <p className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{Number(invoice.total_base).toLocaleString()}</p>
                        </Card>
                        <div className="rounded-xl border p-5"
                            style={{ background: profit >= 0 ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', borderColor: profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>هامش الربح</p>
                            <p className="font-bold" style={{ color: profit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                {Number(profit).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {invoice.notes && (
                    <Card bodyClassName="py-4">
                        <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('accounting.description')}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text)' }}>{invoice.notes}</p>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
