import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, SecondaryButton, InputField, Checkbox } from '@/Core/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Customer {
    id?: number; name: string; phone: string | null;
    email: string | null; address: string | null;
    credit_limit: number; is_active: boolean;
}

export default function CustomerForm({ customer }: { customer?: Customer }) {
    const { t } = useTranslation();
    const { data, setData, post, put, processing, errors } = useForm({
        name:         customer?.name         ?? '',
        phone:        customer?.phone        ?? '',
        email:        customer?.email        ?? '',
        address:      customer?.address      ?? '',
        credit_limit: customer?.credit_limit ?? 0,
        is_active:    customer?.is_active    ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        customer?.id ? put(`/customers/${customer.id}`) : post('/customers');
    };

    const isEdit = !!customer?.id;

    return (
        <AppLayout>
            <Head title={isEdit ? t('common.edit') : t('crm.newCustomer')} />
            <div className="max-w-2xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.crm') }, { label: t('nav.customers'), href: '/customers' }, { label: isEdit ? t('common.edit') : t('common.create') }]}
                    title={isEdit ? t('common.edit') : t('crm.newCustomer')}
                />
                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <InputField
                            label={`${t('crm.name')} *`}
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            error={errors.name}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label={t('crm.phone')}
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                            <InputField
                                label={t('crm.email')}
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={errors.email}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>
                                {t('crm.address')}
                            </label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2}
                                className="w-full py-2.5 text-sm rounded-lg border outline-none resize-none transition-all"
                                style={{ paddingInlineStart: '0.75rem', paddingInlineEnd: '0.75rem', background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }} />
                        </div>
                        <InputField
                            label={t('crm.balance')}
                            type="number"
                            value={data.credit_limit}
                            min={0} step="0.01"
                            onChange={e => setData('credit_limit', +e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                            <label htmlFor="is_active" className="text-sm font-medium cursor-pointer" style={{ color: 'var(--color-text-strong)' }}>
                                {t('common.active')}
                            </label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <PrimaryButton type="submit" loading={processing}>
                                <Save size={15} /> {t('common.save')}
                            </PrimaryButton>
                            <Link href="/customers">
                                <SecondaryButton type="button">{t('common.cancel')}</SecondaryButton>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
