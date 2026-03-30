import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, Badge, DataTableCard } from '@/Core/Components/UI';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Invoice {
    id: number; number: string; date: string; due_date: string;
    status: string; total: number; paid: number;
    supplier_invoice_number: string | null; notes: string | null;
    supplier: { name: string };
    currency: { code: string; symbol: string } | null;
    order: { number: string } | null;
    items: { id: number; quantity: number; unit_cost: number; total: number; product: { name: string } }[];
}

const statusVariant: Record<string, any> = {
    draft: 'default', posted: 'primary', partial: 'warning', paid: 'success', cancelled: 'danger',
};
const statusLabels: Record<string, string> = {
    draft: 'مسودة', posted: 'مرحّلة', partial: 'جزئي', paid: 'مدفوعة', cancelled: 'ملغية',
};

export default function PurchaseInvoiceShow({ invoice }: { invoice: Invoice }) {
    const { t } = useTranslation();
    const sym     = invoice.currency?.symbol ?? '';
    const balance = invoice.total - invoice.paid;

    const columns = [
        { key: 'product',   label: t('inventory.itemName'), render: (_: any, row: any) => row.product?.name },
        { key: 'quantity',  label: t('payments.amount'),    render: (v: number) => v.toLocaleString() },
        { key: 'unit_cost', label: t('inventory.costPrice'), render: (v: number) => `${sym} ${Number(v).toLocaleString()}` },
        { key: 'total',     label: t('accounting.balance'),  render: (v: number) => `${sym} ${Number(v).toLocaleString()}` },
    ];

    return (
        <AppLayout>
            <Head title={`فاتورة شراء ${invoice.number}`} />
            <div className="max-w-4xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.purchasing') }, { label: t('nav.purchaseInvoices'), href: '/purchase-invoices' }, { label: invoice.number }]}
                    title={invoice.number}
                    actions={<Badge variant={statusVariant[invoice.status]}>{statusLabels[invoice.status]}</Badge>}
                />
                <Flash />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: t('crm.suppliers'),        value: invoice.supplier?.name },
                        { label: 'تاريخ الفاتورة',          value: invoice.date },
                        { label: 'تاريخ الاستحقاق',         value: invoice.due_date || '—' },
                        { label: 'أمر الشراء',               value: invoice.order?.number || 'مباشر' },
                    ].map(item => (
                        <Card key={item.label} bodyClassName="py-4">
                            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                            <p className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{item.value}</p>
                        </Card>
                    ))}
                </div>

                {invoice.supplier_invoice_number && (
                    <Card bodyClassName="py-4">
                        <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>رقم فاتورة المورد</p>
                        <p className="font-mono font-medium" style={{ color: 'var(--color-text-strong)' }}>{invoice.supplier_invoice_number}</p>
                    </Card>
                )}

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
