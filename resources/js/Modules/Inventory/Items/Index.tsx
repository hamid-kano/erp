import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Badge, DataTableCard, Pagination, PrimaryButton, Select } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface Item {
    id: number; name: string; sku: string | null;
    item_type: string; cost_price: number; sell_price: number;
    is_active: boolean; item_group?: { name: string };
}

export default function ItemsIndex({ items, itemGroups, filters }: {
    items: { data: Item[]; total: number; from: number; to: number; links: any[] };
    itemGroups: { id: number; name: string }[];
    filters: { search?: string; item_group_id?: string; item_type?: string };
}) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');

    const columns = [
        { key: 'name', label: t('inventory.itemName'), render: (v: string, row: Item) => (
            <div>
                <p className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{v}</p>
                {row.sku && <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.sku}</p>}
            </div>
        )},
        { key: 'item_group', label: t('inventory.itemGroup'), render: (_: any, row: Item) => row.item_group?.name ?? '—' },
        { key: 'item_type',  label: t('inventory.itemType'),  render: (v: string) => <Badge variant="info">{t(`inventory.itemTypes.${v}`)}</Badge> },
        { key: 'cost_price', label: t('inventory.costPrice'), render: (v: number) => Number(v).toLocaleString() },
        { key: 'sell_price', label: t('inventory.sellPrice'), render: (v: number) => Number(v).toLocaleString() },
        { key: 'is_active',  label: t('common.status'),
            render: (v: boolean) => <Badge variant={v ? 'success' : 'default'} dot>{v ? t('common.active') : t('common.inactive')}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Item) => (
            <div className="flex items-center gap-2 justify-end">
                <Link href={`/items/${row.id}`} style={{ color: 'var(--color-text-muted)' }}><Eye size={15} /></Link>
                <Link href={`/items/${row.id}/edit`} style={{ color: 'var(--color-text-muted)' }}><Pencil size={15} /></Link>
                <button onClick={() => { if (confirm(t('common.confirm') + '?')) router.delete(`/items/${row.id}`); }}
                    style={{ color: 'var(--color-text-muted)' }}><Trash2 size={15} /></button>
            </div>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('inventory.items')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.inventory') }, { label: t('nav.items') }]}
                    title={t('inventory.items')}
                    actions={
                        <Link href="/items/create">
                            <PrimaryButton><Plus size={16} /> {t('inventory.newItem')}</PrimaryButton>
                        </Link>
                    }
                />
                <Flash />
                <div className="flex gap-3">
                    <form onSubmit={e => { e.preventDefault(); router.get('/items', { search }, { preserveState: true }); }}
                        className="relative flex-1">
                        <Search size={15} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={`${t('common.search')}...`}
                            className="w-full py-2.5 text-sm rounded-lg border outline-none"
                            style={{
                                paddingInlineStart: '2.25rem', paddingInlineEnd: '0.75rem',
                                background: 'var(--color-surface-2)', borderColor: 'var(--color-border)',
                                color: 'var(--color-text-strong)',
                            }} />
                    </form>
                    <Select value={filters.item_group_id ?? ''} className="w-48"
                        onChange={e => router.get('/items', { ...filters, item_group_id: e.target.value })}>
                        <option value="">{t('common.all')} {t('nav.itemGroups')}</option>
                        {itemGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </Select>
                    <Select value={filters.item_type ?? ''} className="w-44"
                        onChange={e => router.get('/items', { ...filters, item_type: e.target.value })}>
                        <option value="">{t('common.all')} {t('inventory.itemType')}</option>
                        {(['raw_material','finished_good','service','asset'] as const).map(v => (
                            <option key={v} value={v}>{t(`inventory.itemTypes.${v}`)}</option>
                        ))}
                    </Select>
                </div>
                <DataTableCard
                    title={t('inventory.items')}
                    subtitle={`${items.total} صنف`}
                    columns={columns}
                    data={items.data}
                    emptyText={t('common.noData')}
                />
                <Pagination links={items.links} from={items.from} to={items.to} total={items.total} />
            </div>
        </AppLayout>
    );
}
