import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, Pagination } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface Customer {
    id: number; name: string; phone: string | null;
    email: string | null; credit_limit: number; is_active: boolean;
}

export default function CustomersIndex({ customers, filters }: {
    customers: { data: Customer[]; total: number; from: number; to: number; links: any[] };
    filters: { search?: string };
}) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');

    const columns = [
        { key: 'name',         label: t('crm.name'),    render: (v: string) => <span className="text-white font-medium">{v}</span> },
        { key: 'phone',        label: t('crm.phone'),   render: (v: string) => v || '—' },
        { key: 'email',        label: t('crm.email'),   render: (v: string) => v || '—' },
        { key: 'credit_limit', label: t('crm.balance'), render: (v: number) => Number(v).toLocaleString() },
        { key: 'is_active',    label: t('common.status'),
            render: (v: boolean) => <Badge variant={v ? 'success' : 'default'} dot>{v ? t('common.active') : t('common.inactive')}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Customer) => (
            <div className="flex items-center gap-2 justify-end">
                <Link href={`/customers/${row.id}/edit`} className="text-slate-400 hover:text-blue-400"><Pencil size={15} /></Link>
                <button onClick={() => { if (confirm(t('common.confirm') + '?')) router.delete(`/customers/${row.id}`); }}
                    className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
            </div>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('crm.customers')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.crm') }, { label: t('nav.customers') }]}
                    title={t('crm.customers')}
                    actions={
                        <Link href="/customers/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            <Plus size={16} /> {t('crm.newCustomer')}
                        </Link>
                    }
                />
                <Flash />
                <form onSubmit={e => { e.preventDefault(); router.get('/customers', { search }, { preserveState: true }); }} className="relative">
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`${t('common.search')}...`}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-blue-500" />
                </form>
                <DataTableCard title={t('crm.customers')} columns={columns} data={customers.data} emptyText={t('common.noData')} />
                <Pagination links={customers.links} from={customers.from} to={customers.to} total={customers.total} />
            </div>
        </AppLayout>
    );
}
