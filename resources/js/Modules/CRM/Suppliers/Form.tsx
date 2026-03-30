import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, SecondaryButton, InputLabel, InputError, TextInput, Checkbox } from '@/Core/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Supplier {
    id?: number; name: string; phone: string; email: string;
    address: string; payment_terms: number; is_active: boolean;
}

export default function SupplierForm({ supplier }: { supplier?: Supplier }) {
    const { t } = useTranslation();
    const { data, setData, post, put, processing, errors } = useForm({
        name:          supplier?.name          ?? '',
        phone:         supplier?.phone         ?? '',
        email:         supplier?.email         ?? '',
        address:       supplier?.address       ?? '',
        payment_terms: supplier?.payment_terms ?? 30,
        is_active:     supplier?.is_active     ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        supplier?.id ? put(`/suppliers/${supplier.id}`) : post('/suppliers');
    };

    const isEdit = !!supplier?.id;

    return (
        <AppLayout>
            <Head title={isEdit ? t('common.edit') : t('crm.newSupplier')} />
            <div className="max-w-2xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.crm') }, { label: t('nav.suppliers'), href: '/suppliers' }, { label: isEdit ? t('common.edit') : t('common.create') }]}
                    title={isEdit ? t('common.edit') : t('crm.newSupplier')}
                />
                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel value={`${t('crm.name')} *`} />
                            <TextInput value={data.name} onChange={e => setData('name', e.target.value)} error={!!errors.name} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value={t('crm.phone')} />
                                <TextInput value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value={t('crm.email')} />
                                <TextInput type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={!!errors.email} />
                                <InputError message={errors.email} />
                            </div>
                        </div>
                        <div>
                            <InputLabel value={t('crm.address')} />
                            <TextInput value={data.address} onChange={e => setData('address', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel value="شروط الدفع (أيام)" />
                            <TextInput type="number" value={data.payment_terms}
                                onChange={e => setData('payment_terms', +e.target.value)} />
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
                            <Link href="/suppliers">
                                <SecondaryButton type="button">{t('common.cancel')}</SecondaryButton>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
