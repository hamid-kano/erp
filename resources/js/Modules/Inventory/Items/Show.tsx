import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, Badge, DataTableCard } from '@/Core/Components/UI';
import { Head, Link } from '@inertiajs/react';
import { Pencil, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Item {
    id: number; name: string; sku: string | null;
    item_type: string; cost_price: number; sell_price: number;
    item_group: { name: string } | null;
    unit: { name: string; symbol: string } | null;
}

interface Movement {
    id: number; quantity: number; type: string;
    unit_cost: number; created_at: string;
}

const movementVariant: Record<string, 'success' | 'danger' | 'primary' | 'info'> = {
    in: 'success', out: 'danger', adjustment: 'primary', transfer: 'info',
};

export default function ItemShow({ item, movements }: {
    item: Item;
    movements: { data: Movement[]; total: number };
}) {
    const { t } = useTranslation();

    const movementColumns = [
        { key: 'type',       label: t('common.status'),
            render: (v: string) => (
                <Badge variant={movementVariant[v] ?? 'default'}>
                    {t(`inventory.movements.${v}`)}
                </Badge>
            )
        },
        { key: 'quantity',   label: t('warehouse.transfer'),
            render: (v: number) => (
                <span className={Number(v) >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                    {Number(v) >= 0 ? '+' : ''}{Number(v).toLocaleString()}
                </span>
            )
        },
        { key: 'unit_cost',  label: t('inventory.costPrice'), render: (v: number) => Number(v).toLocaleString() },
        { key: 'created_at', label: t('accounting.date'),     render: (v: string) => new Date(v).toLocaleDateString('ar') },
    ];

    return (
        <AppLayout>
            <Head title={item.name} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[
                        { label: t('nav.inventory') },
                        { label: t('nav.items'), href: '/items' },
                        { label: item.name },
                    ]}
                    title={item.name}
                    subtitle={item.sku ? `SKU: ${item.sku}` : undefined}
                    actions={
                        <Link href={`/items/${item.id}/edit`}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors">
                            <Pencil size={14} /> {t('common.edit')}
                        </Link>
                    }
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: t('inventory.itemGroup'), value: item.item_group?.name ?? '—' },
                        { label: t('inventory.itemType'),  value: t(`inventory.itemTypes.${item.item_type}`) },
                        { label: t('inventory.costPrice'), value: `${Number(item.cost_price).toLocaleString()} ر.س` },
                        { label: t('inventory.sellPrice'), value: `${Number(item.sell_price).toLocaleString()} ر.س` },
                    ].map(card => (
                        <Card key={card.label} bodyClassName="py-4">
                            <p className="text-slate-400 text-xs mb-1">{card.label}</p>
                            <p className="text-white font-semibold">{card.value}</p>
                        </Card>
                    ))}
                </div>

                <DataTableCard
                    title={t('inventory.stockMovements')}
                    subtitle={`${movements.total} حركة`}
                    columns={movementColumns}
                    data={movements.data}
                    emptyText={t('common.noData')}
                />
            </div>
        </AppLayout>
    );
}
