import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, Badge, DataTableCard } from '@/Core/Components/UI';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Line  { id: number; debit: number; credit: number; account: { code: string; name: string }; }
interface Entry { id: number; date: string; description: string; reference: string; posted_at: string | null; lines: Line[]; }

export default function JournalEntryShow({ entry }: { entry: Entry }) {
    const { t } = useTranslation();
    const totalDebit  = entry.lines.reduce((s, l) => s + +l.debit,  0);
    const totalCredit = entry.lines.reduce((s, l) => s + +l.credit, 0);

    const columns = [
        { key: 'account', label: t('accounting.accounts'),
            render: (_: any, row: Line) => `${row.account?.code} - ${row.account?.name}`
        },
        { key: 'debit',  label: t('accounting.debit'),
            render: (v: number) => +v > 0
                ? <span className="font-mono" style={{ color: 'var(--color-success)' }}>{Number(v).toLocaleString()}</span>
                : <span style={{ color: 'var(--color-text-muted)' }}>—</span>
        },
        { key: 'credit', label: t('accounting.credit'),
            render: (v: number) => +v > 0
                ? <span className="font-mono" style={{ color: 'var(--color-danger)' }}>{Number(v).toLocaleString()}</span>
                : <span style={{ color: 'var(--color-text-muted)' }}>—</span>
        },
    ];

    return (
        <AppLayout>
            <Head title="تفاصيل القيد" />
            <div className="max-w-3xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: t('nav.journalEntries'), href: '/journal-entries' }, { label: 'تفاصيل القيد' }]}
                    title="تفاصيل القيد"
                    actions={<Badge variant={entry.posted_at ? 'success' : 'warning'} dot>{entry.posted_at ? 'مرحّل' : 'مسودة'}</Badge>}
                />

                <div className="grid grid-cols-3 gap-4">
                    {[
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
                            <span>{t('accounting.debit')}: <span className="font-bold" style={{ color: 'var(--color-success)' }}>{totalDebit.toLocaleString()}</span></span>
                            <span>{t('accounting.credit')}: <span className="font-bold" style={{ color: 'var(--color-danger)' }}>{totalCredit.toLocaleString()}</span></span>
                        </div>
                    }
                />
            </div>
        </AppLayout>
    );
}
