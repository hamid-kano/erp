import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, SecondaryButton, InputLabel, InputError, TextInput, Checkbox, Select } from '@/Core/Components/UI';
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

export default function ItemForm({ item, itemGroups, units }: {
    item?: Item; itemGroups: ItemGroup[]; units: Unit[];
}) {
    const { t } = useTranslation();
    const { data, setData, post, put, processing, errors } = useForm({
        name:          item?.name          ?? '',
        sku:           item?.sku           ?? '',
        item_group_id: item?.item_group_id ?? '',
        unit_id:       item?.unit_id       ?? '',
        item_type:     item?.item_type     ?? 'finished_good',
        cost_price:    item?.cost_price    ?? 0,
        sell_price:    item?.sell_price    ?? 0,
        reorder_point: item?.reorder_point ?? 0,
        cost_method:   item?.cost_method   ?? 'fifo',
        is_active:     item?.is_active     ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        item?.id ? put(`/items/${item.id}`) : post('/items');
    };

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
                            <div>
                                <InputLabel value={`${t('inventory.itemName')} *`} />
                                <TextInput value={data.name} onChange={e => setData('name', e.target.value)} error={!!errors.name} />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <InputLabel value={t('inventory.sku')} />
                                <TextInput value={data.sku} onChange={e => setData('sku', e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value={t('inventory.itemGroup')} />
                                <Select value={data.item_group_id} onChange={e => setData('item_group_id', e.target.value)}>
                                    <option value="">-- {t('common.all')} --</option>
                                    {itemGroups.map(g => (
                                        <option key={g.id} value={g.id}>{'—'.repeat(g.depth)} {g.name}</option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <InputLabel value={t('inventory.itemType')} />
                                <Select value={data.item_type} onChange={e => setData('item_type', e.target.value)}>
                                    {(['finished_good','raw_material','service','asset'] as const).map(v => (
                                        <option key={v} value={v}>{t(`inventory.itemTypes.${v}`)}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div>
                            <InputLabel value={t('inventory.unit')} />
                            <Select value={data.unit_id} onChange={e => setData('unit_id', e.target.value)}>
                                <option value="">-- {t('common.all')} --</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value={t('inventory.costPrice')} />
                                <TextInput type="number" value={data.cost_price} min={0} step="0.01"
                                    onChange={e => setData('cost_price', +e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('inventory.sellPrice')} />
                                <TextInput type="number" value={data.sell_price} min={0} step="0.01"
                                    onChange={e => setData('sell_price', +e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value={t('inventory.reorderPoint')} />
                                <TextInput type="number" value={data.reorder_point} min={0} step="0.001"
                                    onChange={e => setData('reorder_point', +e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('inventory.costMethod')} />
                                <Select value={data.cost_method} onChange={e => setData('cost_method', e.target.value)}>
                                    <option value="fifo">{t('inventory.fifo')}</option>
                                    <option value="weighted">{t('inventory.weighted')}</option>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox id="is_active" checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)} />
                            <InputLabel htmlFor="is_active" value={t('common.active')} className="mb-0 cursor-pointer" />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <PrimaryButton type="submit" loading={processing}>
                                <Save size={15} /> {t('common.save')}
                            </PrimaryButton>
                            <Link href="/items">
                                <SecondaryButton type="button">{t('common.cancel')}</SecondaryButton>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
