import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Badge } from '@/Core/Components/UI';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Warehouse } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WarehouseItem {
    id: number; name: string; city: string; is_active: boolean;
}

export default function WarehouseIndex({ warehouses }: { warehouses: { data: WarehouseItem[] } }) {
    const { t } = useTranslation();

    return (
        <AppLayout>
            <Head title={t('warehouse.warehouses')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.warehouses') }]}
                    title={t('warehouse.warehouses')}
                    actions={
                        <Link href="/warehouses/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            <Plus size={16} /> {t('warehouse.newWarehouse')}
                        </Link>
                    }
                />
                <Flash />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {warehouses.data.map(w => (
                        <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                                    <Warehouse size={18} className="text-blue-400" />
                                </div>
                                <Badge variant={w.is_active ? 'success' : 'default'} dot>
                                    {w.is_active ? t('common.active') : t('common.inactive')}
                                </Badge>
                            </div>
                            <h3 className="text-white font-semibold">{w.name}</h3>
                            <p className="text-slate-400 text-sm mt-1">{w.city || '—'}</p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                                <Link href={`/warehouses/${w.id}`} className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs">
                                    <Eye size={13} /> {t('common.actions')}
                                </Link>
                                <Link href={`/warehouses/${w.id}/edit`} className="flex items-center gap-1 text-slate-400 hover:text-blue-400 text-xs">
                                    <Pencil size={13} /> {t('common.edit')}
                                </Link>
                                <button onClick={() => { if (confirm(t('common.confirm') + '?')) router.delete(`/warehouses/${w.id}`); }}
                                    className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-xs mr-auto">
                                    <Trash2 size={13} /> {t('common.delete')}
                                </button>
                            </div>
                        </div>
                    ))}
                    {warehouses.data.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-slate-500">{t('common.noData')}</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
