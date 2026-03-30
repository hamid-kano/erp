import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, Badge, DataTableCard, PrimaryButton, InputField } from '@/Core/Components/UI';
import { Head, router, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface Line  { id: number; debit: number; credit: number; description: string; account: { code: string; name: string }; }
interface Entry {
    id: number; number: string; date: string; description: string;
    reference: string; status: 'draft' | 'posted' | 'reversed';
    posted_at: string | null; lines: Line[];
    reversed_entry?: { id: number; number: string } | null;
}

function ReverseModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({ reason: '' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="rounded-xl p-6 w-full max-w-md space-y-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <h3 className="font-semibold text-base" style={{ color: 'var(--color-text-strong)' }}>
                    عكس القيد {entry.number}
                </h3>
                <InputField
                    label="سبب العكس *"
                    value={data.reason}
                    onChange={e => setData('reason', e.target.value)}
                    error={errors.reason}
                />
                <div className="flex gap-3">
                    <PrimaryButton
                        loading={processing}
                        disabled={!data.reason}
                        onClick={() => post(`/journal-entries/${entry.id}/reverse`)}
                        className="bg-red-500 hover:bg-red-600">
                        تأكيد العكس
                    </PrimaryButton>
                    <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg border"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}

const statusBadge = (status: string) => {
    if (status === 'reversed') return <Badge variant="danger" dot>معكوس</Badge>;
    if (status === 'posted')   return <Badge variant="success" dot>مرحّل</Badge>;
    return <Badge variant="warning" dot>مسودة</Badge>;
};

export default function JournalEntryShow({ entry }: { entry: Entry }) {
    const { t } = useTranslation();
    const [showReverse, setShowReverse] = useState(false);

    const totalDebit  = entry.lines.reduce((s, l) => s + +l.debit,  0);
    const totalCredit = entry.lines.reduce((s, l) => s + +l.credit, 0);
    const fmt = (n: number) => Number(n).toLocaleString();

    const columns = [
        { key: 'account', label: t('accounting.accounts'),
            render: (_: any, row: Line) => `${row.account?.code} - ${row.account?.name}`
        },
        { key: 'description', label: 'البيان',
            render: (v: string) => <span style={{ color: 'var(--color-text-muted)' }}>{v || '—'}</span>
        },
        { key: 'debit',  label: t('accounting.debit'),
            render: (v: number) => +v > 0
                ? <span className="font-mono" style={{ color: 'var(--color-success)' }}>{fmt(v)}</span>
                : <span style={{ color: 'var(--color-text-muted)' }}>—</span>
        },
        { key: 'credit', label: t('accounting.credit'),
            render: (v: number) => +v > 0
                ? <span className="font-mono" style={{ color: 'var(--color-danger)' }}>{fmt(v)}</span>
                : <span style={{ color: 'var(--color-text-muted)' }}>—</span>
        },
    ];

    return (
        <AppLayout>
            <Head title="تفاصيل القيد" />
            {showReverse && <ReverseModal entry={entry} onClose={() => setShowReverse(false)} />}
            <div className="max-w-3xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: t('nav.journalEntries'), href: '/journal-entries' }, { label: entry.number ?? `#${entry.id}` }]}
                    title={entry.number ?? `قيد #${entry.id}`}
                    actions={
                        <div className="flex items-center gap-3">
                            {statusBadge(entry.status)}
                            {entry.status === 'posted' && (
                                <button onClick={() => setShowReverse(true)}
                                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border"
                                    style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                                    <RotateCcw size={13} /> عكس القيد
                                </button>
                            )}
                        </div>
                    }
                />
                <Flash />

                {entry.status === 'reversed' && entry.reversed_entry && (
                    <div className="rounded-lg px-4 py-3 text-sm flex items-center gap-2"
                        style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--color-danger)' }}>
                        <RotateCcw size={14} />
                        تم عكس هذا القيد — القيد العكسي:
                        <a href={`/journal-entries/${entry.reversed_entry.id}`}
                            className="font-mono font-medium underline">
                            {entry.reversed_entry.number}
                        </a>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'رقم القيد',              value: entry.number ?? `#${entry.id}` },
                        { label: t('accounting.date'),        value: entry.date },
                        { label: t('accounting.description'), value: entry.description },
                        { label: t('accounting.reference'),   value: entry.reference || '—' },
                    ].map(item => (
                        <Card key={item.label} bodyClassName="py-4">
                            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                            <p className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{item.value}</p>
                        </Card>
                    ))}
                </div>

                <DataTableCard
                    title="سطور القيد"
                    columns={columns}
                    data={entry.lines}
                    footer={
                        <div className="flex justify-end gap-8 text-sm">
                            <span>{t('accounting.debit')}: <span className="font-bold" style={{ color: 'var(--color-success)' }}>{fmt(totalDebit)}</span></span>
                            <span>{t('accounting.credit')}: <span className="font-bold" style={{ color: 'var(--color-danger)' }}>{fmt(totalCredit)}</span></span>
                        </div>
                    }
                />
            </div>
        </AppLayout>
    );
}
