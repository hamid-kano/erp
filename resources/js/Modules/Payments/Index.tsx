import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, DataTableCard, Badge, PrimaryButton, SecondaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, XCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Payment {
    id: number; number: string; amount: number; method: string;
    date: string; direction: 'in' | 'out'; status: string; notes: string;
}
interface PendingInvoice { id: number; number: string; total: number; paid: number; date: string; }

const methodMap: Record<string, string> = {
    cash: 'نقدي', bank: 'تحويل بنكي', cheque: 'شيك', other: 'أخرى',
};

function PaymentForm({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        amount: '', method: 'cash',
        date: new Date().toISOString().split('T')[0],
        direction: 'in', invoice_type: '', invoice_id: '', notes: '',
    });

    const [invoices, setInvoices] = useState<PendingInvoice[]>([]);

    useEffect(() => {
        if (!data.invoice_type) { setInvoices([]); return; }
        fetch(`/payments/pending-invoices?type=${data.invoice_type}`)
            .then(r => r.json()).then(setInvoices);
    }, [data.invoice_type]);

    const selectedInvoice = invoices.find(i => i.id === +data.invoice_id);

    return (
        <Card title="تسجيل دفعة جديدة">
            <form onSubmit={e => { e.preventDefault(); post('/payments', { onSuccess: onClose }); }}
                className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <InputField label="المبلغ *" type="number" min="0.01" step="0.01"
                        value={data.amount} onChange={e => setData('amount', e.target.value)} error={errors.amount} />
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>طريقة الدفع</label>
                        <Select value={data.method} onChange={e => setData('method', e.target.value)}>
                            {Object.entries(methodMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </Select>
                    </div>
                    <InputField label="التاريخ *" type="date"
                        value={data.date} onChange={e => setData('date', e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>الاتجاه</label>
                        <Select value={data.direction} onChange={e => setData('direction', e.target.value)}>
                            <option value="in">وارد — قبض من عميل</option>
                            <option value="out">صادر — دفع لمورد</option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>نوع الفاتورة</label>
                        <Select value={data.invoice_type} onChange={e => { setData('invoice_type', e.target.value); setData('invoice_id', ''); }}>
                            <option value="">بدون فاتورة</option>
                            <option value="sales">فاتورة مبيعات</option>
                            <option value="purchase">فاتورة مشتريات</option>
                        </Select>
                    </div>
                    {data.invoice_type && (
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>الفاتورة</label>
                            <Select value={data.invoice_id} onChange={e => setData('invoice_id', e.target.value)}>
                                <option value="">اختر فاتورة...</option>
                                {invoices.map(i => (
                                    <option key={i.id} value={i.id}>
                                        {i.number} — المتبقي: {(+i.total - +i.paid).toLocaleString()}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    )}
                </div>

                {selectedInvoice && (
                    <div className="rounded-lg px-4 py-2 text-sm flex gap-6"
                        style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                        <span>الإجمالي: <strong>{Number(selectedInvoice.total).toLocaleString()}</strong></span>
                        <span>المدفوع: <strong>{Number(selectedInvoice.paid).toLocaleString()}</strong></span>
                        <span style={{ color: 'var(--color-danger)' }}>المتبقي: <strong>{(+selectedInvoice.total - +selectedInvoice.paid).toLocaleString()}</strong></span>
                    </div>
                )}

                <InputField label="ملاحظات" value={data.notes} onChange={e => setData('notes', e.target.value)} />

                <div className="flex gap-3 pt-2">
                    <PrimaryButton type="submit" loading={processing}>حفظ الدفعة</PrimaryButton>
                    <SecondaryButton type="button" onClick={onClose}>إلغاء</SecondaryButton>
                </div>
            </form>
        </Card>
    );
}

export default function PaymentsIndex({ payments, filters }: { payments: { data: Payment[] }; filters: any }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);

    const totalIn  = payments.data.filter(p => p.direction === 'in').reduce((s, p) => s + +p.amount, 0);
    const totalOut = payments.data.filter(p => p.direction === 'out').reduce((s, p) => s + +p.amount, 0);

    const columns = [
        { key: 'number', label: 'رقم الدفعة', render: (v: string) => <span className="font-mono text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{v}</span> },
        { key: 'date',   label: t('accounting.date') },
        { key: 'amount', label: t('payments.amount'),
            render: (v: number) => <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{Number(v).toLocaleString()}</span>
        },
        { key: 'method',    label: 'الطريقة', render: (v: string) => methodMap[v] || v },
        { key: 'direction', label: 'الاتجاه',
            render: (v: string) => <Badge variant={v === 'in' ? 'success' : 'danger'} dot>{v === 'in' ? 'قبض' : 'دفع'}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Payment) => (
            row.status === 'posted' && (
                <button onClick={() => { if (confirm('إلغاء الدفعة؟')) router.post(`/payments/${row.id}/cancel`); }}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                    style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.08)' }}>
                    <XCircle size={12} /> إلغاء
                </button>
            )
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('payments.title')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.payments') }]}
                    title={t('payments.title')}
                    actions={<PrimaryButton onClick={() => setShowForm(!showForm)}><Plus size={16} /> تسجيل دفعة</PrimaryButton>}
                />
                <Flash />

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border p-4 flex items-center gap-3"
                        style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'var(--color-success)' }}>
                        <ArrowDownCircle size={20} style={{ color: 'var(--color-success)' }} />
                        <div>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>إجمالي المقبوضات</p>
                            <p className="font-bold" style={{ color: 'var(--color-success)' }}>{totalIn.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="rounded-xl border p-4 flex items-center gap-3"
                        style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'var(--color-danger)' }}>
                        <ArrowUpCircle size={20} style={{ color: 'var(--color-danger)' }} />
                        <div>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>إجمالي المدفوعات</p>
                            <p className="font-bold" style={{ color: 'var(--color-danger)' }}>{totalOut.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {showForm && <PaymentForm onClose={() => setShowForm(false)} />}

                <DataTableCard title={t('payments.title')} columns={columns} data={payments.data} emptyText={t('common.noData')} />
            </div>
        </AppLayout>
    );
}
