import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, DataTableCard, Badge, PrimaryButton, SecondaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Payment {
    id: number; amount: number; method: string;
    date: string; direction: 'in' | 'out'; notes: string;
}

const methodMap: Record<string, string> = {
    cash: 'نقدي', bank: 'تحويل بنكي', check: 'شيك', card: 'بطاقة',
};

export default function PaymentsIndex({ payments, filters }: { payments: { data: Payment[] }; filters: any }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        amount: '', method: 'cash',
        date: new Date().toISOString().split('T')[0],
        direction: 'in', notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/payments', { onSuccess: () => { reset(); setShowForm(false); } });
    };

    const totalIn  = payments.data.filter(p => p.direction === 'in').reduce((s, p) => s + +p.amount, 0);
    const totalOut = payments.data.filter(p => p.direction === 'out').reduce((s, p) => s + +p.amount, 0);

    const columns = [
        { key: 'date',   label: t('accounting.date') },
        { key: 'amount', label: t('payments.amount'),
            render: (v: number) => <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{Number(v).toLocaleString()} ر.س</span>
        },
        { key: 'method',    label: 'الطريقة', render: (v: string) => methodMap[v] || v },
        { key: 'direction', label: 'الاتجاه',
            render: (v: string) => (
                <Badge variant={v === 'in' ? 'success' : 'danger'} dot>
                    {v === 'in' ? t('payments.in') : t('payments.out')}
                </Badge>
            )
        },
        { key: 'id', label: '', render: (_: any, row: Payment) => (
            <button onClick={() => { if (confirm(t('common.confirm') + '?')) router.delete(`/payments/${row.id}`); }}
                style={{ color: 'var(--color-text-muted)' }}>
                <Trash2 size={15} />
            </button>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('payments.title')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.payments') }]}
                    title={t('payments.title')}
                    actions={
                        <PrimaryButton onClick={() => setShowForm(!showForm)}>
                            <Plus size={16} /> تسجيل دفعة
                        </PrimaryButton>
                    }
                />
                <Flash />

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border p-4 flex items-center gap-3"
                        style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'var(--color-success)' }}>
                        <ArrowDownCircle size={20} style={{ color: 'var(--color-success)' }} />
                        <div>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('payments.in')}</p>
                            <p className="font-bold" style={{ color: 'var(--color-success)' }}>{totalIn.toLocaleString()} ر.س</p>
                        </div>
                    </div>
                    <div className="rounded-xl border p-4 flex items-center gap-3"
                        style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'var(--color-danger)' }}>
                        <ArrowUpCircle size={20} style={{ color: 'var(--color-danger)' }} />
                        <div>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t('payments.out')}</p>
                            <p className="font-bold" style={{ color: 'var(--color-danger)' }}>{totalOut.toLocaleString()} ر.س</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <Card title="تسجيل دفعة جديدة">
                        <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                            <InputField label={`${t('payments.amount')} *`} type="number" value={data.amount}
                                onChange={e => setData('amount', e.target.value)} min="0.01" step="0.01" />
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>طريقة الدفع</label>
                                <Select value={data.method} onChange={e => setData('method', e.target.value)}>
                                    {Object.entries(methodMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </Select>
                            </div>
                            <InputField label={t('accounting.date')} type="date" value={data.date}
                                onChange={e => setData('date', e.target.value)} />
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>الاتجاه</label>
                                <Select value={data.direction} onChange={e => setData('direction', e.target.value as any)}>
                                    <option value="in">وارد (قبض)</option>
                                    <option value="out">صادر (دفع)</option>
                                </Select>
                            </div>
                            <div className="col-span-2 flex gap-2 pt-2">
                                <PrimaryButton type="submit" loading={processing}>{t('common.save')}</PrimaryButton>
                                <SecondaryButton type="button" onClick={() => setShowForm(false)}>{t('common.cancel')}</SecondaryButton>
                            </div>
                        </form>
                    </Card>
                )}

                <DataTableCard title={t('payments.title')} columns={columns} data={payments.data} emptyText={t('common.noData')} />
            </div>
        </AppLayout>
    );
}
