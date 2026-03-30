import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, PrimaryButton } from '@/Core/Components/UI';
import { Head, Link } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Entry {
    id: number; number: string; date: string; description: string;
    reference: string; posted_at: string | null; lines_count: number;
}

export default function JournalEntriesIndex({ entries }: { entries: { data: Entry[] } }) {
    const { t } = useTranslation();

    const columns = [
        { key: 'number',      label: 'رقم القيد',  render: (v: string) => <span className="font-mono text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{v ?? '—'}</span> },
        { key: 'date',        label: t('accounting.date') },
        { key: 'description', label: t('accounting.description'), render: (v: string) => <span style={{ color: 'var(--color-text-strong)' }}>{v}</span> },
        { key: 'reference',   label: t('accounting.reference'),   render: (v: string) => v ? <span className="font-mono text-xs">{v}</span> : '—' },
        { key: 'lines_count', label: 'السطور' },
        { key: 'posted_at',   label: t('common.status'),
            render: (v: string | null) => <Badge variant={v ? 'success' : 'warning'} dot>{v ? 'مرحّل' : 'مسودة'}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Entry) => (
            <Link href={`/journal-entries/${row.id}`} style={{ color: 'var(--color-text-muted)' }}><Eye size={15} /></Link>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('nav.journalEntries')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: t('nav.journalEntries') }]}
                    title={t('nav.journalEntries')}
                    actions={
                        <Link href="/journal-entries/create">
                            <PrimaryButton><Plus size={16} /> قيد جديد</PrimaryButton>
                        </Link>
                    }
                />
                <Flash />
                <DataTableCard title={t('nav.journalEntries')} columns={columns} data={entries.data} emptyText={t('common.noData')} />
            </div>
        </AppLayout>
    );
}
