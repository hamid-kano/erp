import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, DataTableCard } from '@/Core/Components/UI';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Item {
    id: number; name: string; sku: string | null;
    reorder_point: number; unit: { symbol: string } | null;
}

export default function StockLevels({ lowStock }: { lowStock: Item[] }) {
    const { t } = useTranslation();

    const columns = [
        { key: 'name', label: t('inventory.itemName'), render: (_: any, row: Item) => (
            <div className="flex items-center gap-2">
                <Package size={15} className="text-slate-500" />
                <div>
                    <p className="text-white font-medium">{row.name}</p>
                    {row.sku && <p className="text-slate-500 font-mono text-xs">{row.sku}</p>}
                </div>
            </div>
        )},
        { key: 'reorder_point', label: t('inventory.reorderPoint'),
            render: (v: number, row: Item) => (
                <span className="text-yellow-400 font-medium">
                    {Number(v).toLocaleString()} {row.unit?.symbol}
                </span>
            )
        },
        { key: 'id', label: '', render: (_: any, row: Item) => (
            <Link href={`/items/${row.id}`} className="text-blue-400 hover:text-blue-300 text-xs">
                {t('common.actions')}
            </Link>
        )},
    ];

    return (
        <AppLayout>
            <Head title={t('nav.stockLevels')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.inventory') }, { label: t('nav.stockLevels') }]}
                    title={t('nav.stockLevels')}
                />

                {lowStock.length === 0 ? (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-10 text-center">
                        <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                        <p className="text-green-400 font-medium">{t('inventory.allGood')}</p>
                    </div>
                ) : (
                    <DataTableCard
                        title={
                            <span className="flex items-center gap-2 text-yellow-400">
                                <AlertTriangle size={16} />
                                {t('inventory.lowStock')} ({lowStock.length})
                            </span>
                        }
                        columns={columns}
                        data={lowStock}
                    />
                )}
            </div>
        </AppLayout>
    );
}
