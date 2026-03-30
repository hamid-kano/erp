import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card } from '@/Core/Components/UI';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Customer {
    id?: number; name: string; phone: string | null;
    email: string | null; address: string | null;
    credit_limit: number; is_active: boolean;
}

const inputCls = 'w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500';
const labelCls = 'block text-sm text-slate-300 mb-1';

export default function CustomerForm({ customer }: { customer?: Customer }) {
    const { t } = useTranslation();
    const { data, setData, post, put, processing, errors } = useForm({
        name:         customer?.name ?? '',
        phone:        customer?.phone ?? '',
        email:        customer?.email ?? '',
        address:      customer?.address ?? '',
        credit_limit: customer?.credit_limit ?? 0,
        is_active:    customer?.is_active ?? true,
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
                        <div>
                            <label className={labelCls}>{t('crm.name')} *</label>
                            <input value={data.name} onChange={e => setData('name', e.target.value)} className={inputCls} />
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>{t('crm.phone')}</label>
                                <input value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>{t('crm.email')}</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputCls} />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>{t('crm.address')}</label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2}
                                className={`${inputCls} resize-none`} />
                        </div>
                        <div>
                            <label className={labelCls}>{t('crm.balance')}</label>
                            <input type="number" value={data.credit_limit} min={0} step="0.01"
                                onChange={e => setData('credit_limit', +e.target.value)} className={inputCls} />
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
                            <Link href="/customers" className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                {t('common.cancel')}
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
