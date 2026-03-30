import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, Pagination, PrimaryButton } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface Supplier {
    id: number; name: string; phone: string;
    email: string; payment_terms: number; is_active: boolean;
}

export default function SuppliersIndex({ suppliers, filters }: {
    suppliers: { data: Supplier[]; total: number; from: number; to: number; links: any[] };
    filters?: { search?: string };
}) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters?.search ?? '');

    const columns = [
        { key: 'name',          label: t('crm.name'),    render: (v: string) => <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{v}</span> },
        { key: 'phone',         label: t('crm.phone'),   render: (v: string) => v || '—' },
        { key: 'email',         label: t('crm.email'),   render: (v: string) => v || '—' },
        { key: 'payment_terms', label: 'شروط الدفع',     render: (v: number) => `${v} يوم` },
        { key: 'is_active',     label: t('common.status'),
            render: (v: boolean) => <Badge variant={v ? 'success' : 'default'} dot>{v ? t('common.active') : t('common.inactive')}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Supplier) => (
            <div className="flex items-center gap-2 justify-end">
                <Link href={`/suppliers/${row.id}/edit`} className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                    <Pencil size={15} />
                </Link>
                <button onClick={() => { if (confirm(t('common.confirm') + '?')) router.delete(`/suppliers/${row.id}`); }}
                    className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>
                    <Trash2 size={15} />
                </button>
            </div>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('crm.suppliers')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.crm') }, { label: t('nav.suppliers') }]}
                    title={t('crm.suppliers')}
                    actions={
                        <Link href="/suppliers/create">
                            <PrimaryButton><Plus size={16} /> {t('crm.newSupplier')}</PrimaryButton>
                        </Link>
                    }
                />
                <Flash />
                <form onSubmit={e => { e.preventDefault(); router.get('/suppliers', { search }, { preserveState: true }); }} className="relative">
                    <Search size={16} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={`${t('common.search')}...`}
                        className="w-full py-2 text-sm rounded-lg border outline-none"
                        style={{
                            paddingInlineStart: '2.25rem', paddingInlineEnd: '0.75rem',
                            background: 'var(--color-surface)', borderColor: 'var(--color-border)',
                            color: 'var(--color-text-strong)',
                        }} />
                </form>
                <DataTableCard title={t('crm.suppliers')} columns={columns} data={suppliers.data} emptyText={t('common.noData')} />
                <Pagination links={suppliers.links} from={suppliers.from} to={suppliers.to} total={suppliers.total} />
            </div>
        </AppLayout>
    );
}
