import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, SecondaryButton, InputLabel, InputError, TextInput, Checkbox } from '@/Core/Components/UI';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WarehouseItem { id?: number; name: string; city: string; is_active: boolean; }

const inputCls = 'w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500';
const labelCls = 'block text-sm text-slate-300 mb-1';

export default function WarehouseForm({ warehouse }: { warehouse?: WarehouseItem }) {
    const { t } = useTranslation();
    const { data, setData, post, put, processing, errors } = useForm({
        name:      warehouse?.name ?? '',
        city:      warehouse?.city ?? '',
        is_active: warehouse?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        warehouse?.id ? put(`/warehouses/${warehouse.id}`) : post('/warehouses');
    };

    const isEdit = !!warehouse?.id;

    return (
        <AppLayout>
            <Head title={isEdit ? t('warehouse.editWarehouse') : t('warehouse.newWarehouse')} />
            <div className="max-w-lg space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.warehouses'), href: '/warehouses' }, { label: isEdit ? t('common.edit') : t('common.create') }]}
                    title={isEdit ? t('warehouse.editWarehouse') : t('warehouse.newWarehouse')}
                />
                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className={labelCls}>{t('warehouse.name')} *</label>
                            <input value={data.name} onChange={e => setData('name', e.target.value)} className={inputCls} />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>{t('warehouse.city')}</label>
                            <input value={data.city} onChange={e => setData('city', e.target.value)} className={inputCls} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="is_active" checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                            <label htmlFor="is_active" className="text-sm text-slate-300 cursor-pointer">{t('common.active')}</label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <PrimaryButton type="submit" loading={processing}>
                                <Save size={15} /> {t('common.save')}
                            </PrimaryButton>
                            <Link href="/warehouses">
                                <SecondaryButton type="button">{t('common.cancel')}</SecondaryButton>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
