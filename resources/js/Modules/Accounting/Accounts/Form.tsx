import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, SecondaryButton, InputField, Select, Checkbox } from '@/Core/Components/UI';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Account  { id?: number; code: string; name: string; type: string; normal_balance: string; parent_id?: number; currency_id?: number; is_postable: boolean; opening_balance: number; opening_balance_date?: string; }
interface Option   { id: number; code: string; name: string; }
interface Currency { id: number; code: string; name: string; symbol: string; }

const types = [
    { value: 'asset', label: 'أصول' }, { value: 'liability', label: 'خصوم' },
    { value: 'equity', label: 'حقوق ملكية' }, { value: 'revenue', label: 'إيرادات' },
    { value: 'expense', label: 'مصاريف' },
];

export default function AccountForm({ account, parents, currencies }: {
    account?: Account; parents: Option[]; currencies: Currency[];
}) {
    const { t } = useTranslation();
    const { data, setData, post, put, processing, errors } = useForm({
        code:                 account?.code                 ?? '',
        name:                 account?.name                 ?? '',
        type:                 account?.type                 ?? 'asset',
        normal_balance:       account?.normal_balance       ?? 'debit',
        parent_id:            account?.parent_id            ?? '',
        currency_id:          account?.currency_id          ?? '',
        is_postable:          account?.is_postable          ?? false,
        opening_balance:      account?.opening_balance      ?? 0,
        opening_balance_date: account?.opening_balance_date ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        account?.id ? put(`/accounts/${account.id}`) : post('/accounts');
    };

    const isEdit = !!account?.id;

    return (
        <AppLayout>
            <Head title={isEdit ? 'تعديل حساب' : 'إضافة حساب'} />
            <div className="max-w-2xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: t('nav.accounts'), href: '/accounts' }, { label: isEdit ? t('common.edit') : t('common.create') }]}
                    title={isEdit ? 'تعديل حساب' : 'إضافة حساب'}
                />
                <Card>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="الكود *" value={data.code} onChange={e => setData('code', e.target.value)} error={errors.code} />
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>النوع *</label>
                                <Select value={data.type} onChange={e => setData('type', e.target.value)}>
                                    {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </Select>
                            </div>
                        </div>
                        <InputField label="الاسم *" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>الطبيعة *</label>
                                <Select value={data.normal_balance} onChange={e => setData('normal_balance', e.target.value)}>
                                    <option value="debit">مدين</option>
                                    <option value="credit">دائن</option>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>العملة</label>
                                <Select value={data.currency_id} onChange={e => setData('currency_id', e.target.value)}>
                                    <option value="">عملة الشركة الافتراضية</option>
                                    {currencies.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>الحساب الأب</label>
                            <Select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}>
                                <option value="">بدون حساب أب</option>
                                {parents.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                            <InputField label="رصيد الافتتاح" type="number" value={data.opening_balance} min={0} step="0.01"
                                onChange={e => setData('opening_balance', +e.target.value)} />
                            <InputField label="تاريخ رصيد الافتتاح" type="date" value={data.opening_balance_date}
                                onChange={e => setData('opening_balance_date', e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_postable" checked={data.is_postable} onChange={e => setData('is_postable', e.target.checked)} />
                            <label htmlFor="is_postable" className="text-sm font-medium cursor-pointer" style={{ color: 'var(--color-text-strong)' }}>
                                قابل للترحيل (يقبل قيوداً)
                            </label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <PrimaryButton type="submit" loading={processing}>
                                <Save size={15} /> {t('common.save')}
                            </PrimaryButton>
                            <Link href="/accounts">
                                <SecondaryButton type="button">{t('common.cancel')}</SecondaryButton>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
