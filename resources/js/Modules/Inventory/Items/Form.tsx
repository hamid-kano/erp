import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card } from '@/Core/Components/UI';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ItemGroup { id: number; name: string; depth: number; }
interface Unit { id: number; name: string; symbol: string; }
interface Item {
    id?: number; name: string; sku: string | null;
    item_group_id: number | null; unit_id: number | null;
    item_type: string; cost_price: number; sell_price: number;
    reorder_point: number; cost_method: string; is_active: boolean;
}

const inputCls = 'w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500';
const labelCls = 'block text-sm text-slate-300 mb-1';

export default function ItemForm({ item, itemGroups, units }: {
    item?: Item; itemGroups: ItemGroup[]; units: Unit[];
}) {
    const { t } = useTranslation();
    const { data, setData, post, put, processing, errors } = useForm({
        name:          item?.name ?? '',
        sku:           item?.sku ?? '',
        item_group_id: item?.item_group_id ?? '',
        unit_id:       item?.unit_id ?? '',
        item_type:     item?.item_type ?? 'finished_good',
        cost_price:    item?.cost_price ?? 0,
        sell_price:    item?.sell_price ?? 0,
        reorder_point: item?.reorder_point ?? 0,
        cost_method:   item?.cost_method ?? 'fifo',
        is_active:     item?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        item?.id ? put(`/items/${item.id}`) : post('/items');
    };

    const field = (label: string, key: keyof typeof data, type = 'text', extra?: object) => (
        <div>
            <label className={labelCls}>{label}</label>
            <input type={type} value={data[key] as any}
                onChange={e => setData(key, type === 'number' ? +e.target.value : e.target.value)}
                className={inputCls} {...extra} />
            {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
        </div>
    );

    const isEdit = !!item?.id;

    return (
        <AppLayout>
            <Head title={isEdit ? t('inventory.editItem') : t('inventory.newItem')} />
            <div className="max-w-2xl space-y-4">
                <PageHeader
                    breadcrumbs={[
                        { label: t('nav.inventory') },
                        { label: t('nav.items'), href: '/items' },
                        { label: isEdit ? t('common.edit') : t('common.create') },
                    ]}
                    title={isEdit ? t('inventory.editItem') : t('inventory.newItem')}
                />
                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {field(`${t('inventory.itemName')} *`, 'name')}
                            {field(t('inventory.sku'), 'sku')}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>{t('inventory.itemGroup')}</label>
                                <select value={data.item_group_id} onChange={e => setData('item_group_id', e.target.value)} className={inputCls}>
                                    <option value="">-- {t('common.all')} --</option>
                                    {itemGroups.map(g => (
                                        <option key={g.id} value={g.id}>{'—'.repeat(g.depth)} {g.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>{t('inventory.itemType')}</label>
                                <select value={data.item_type} onChange={e => setData('item_type', e.target.value)} className={inputCls}>
                                    {(['finished_good','raw_material','service','asset'] as const).map(v => (
                                        <option key={v} value={v}>{t(`inventory.itemTypes.${v}`)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>{t('inventory.unit')}</label>
                            <select value={data.unit_id} onChange={e => setData('unit_id', e.target.value)} className={inputCls}>
                                <option value="">-- {t('common.all')} --</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {field(t('inventory.costPrice'), 'cost_price', 'number', { min: 0, step: '0.01' })}
                            {field(t('inventory.sellPrice'), 'sell_price', 'number', { min: 0, step: '0.01' })}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {field(t('inventory.reorderPoint'), 'reorder_point', 'number', { min: 0, step: '0.001' })}
                            <div>
                                <label className={labelCls}>{t('inventory.costMethod')}</label>
                                <select value={data.cost_method} onChange={e => setData('cost_method', e.target.value)} className={inputCls}>
                                    <option value="fifo">{t('inventory.fifo')}</option>
                                    <option value="weighted">{t('inventory.weighted')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="is_active" checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                            <label htmlFor="is_active" className="text-sm text-slate-300 cursor-pointer">{t('common.active')}</label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                <Save size={16} /> {processing ? t('common.saving') : t('common.save')}
                            </button>
                            <Link href="/items" className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                {t('common.cancel')}
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
