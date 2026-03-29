import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowRight } from 'lucide-react';

interface Account {
    id?: number; code: string; name: string; type: string;
    normal_balance: string; parent_id?: number; currency_id?: number;
    is_postable: boolean; opening_balance: number; opening_balance_date?: string;
}
interface Option    { id: number; code: string; name: string; }
interface Currency  { id: number; code: string; name: string; symbol: string; }

const types = [
    { value: 'asset',     label: 'أصول' },
    { value: 'liability', label: 'خصوم' },
    { value: 'equity',    label: 'حقوق ملكية' },
    { value: 'revenue',   label: 'إيرادات' },
    { value: 'expense',   label: 'مصاريف' },
];

export default function AccountForm({ account, parents, currencies }: {
    account?: Account; parents: Option[]; currencies: Currency[];
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        code:                 account?.code ?? '',
        name:                 account?.name ?? '',
        type:                 account?.type ?? 'asset',
        normal_balance:       account?.normal_balance ?? 'debit',
        parent_id:            account?.parent_id ?? '',
        currency_id:          account?.currency_id ?? '',
        is_postable:          account?.is_postable ?? false,
        opening_balance:      account?.opening_balance ?? 0,
        opening_balance_date: account?.opening_balance_date ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        account?.id ? put(`/accounts/${account.id}`) : post('/accounts');
    };

    return (
        <AppLayout>
            <Head title={account ? 'تعديل حساب' : 'إضافة حساب'} />
            <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <Link href="/accounts" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></Link>
                    <h1 className="text-xl font-bold text-white">{account ? 'تعديل حساب' : 'إضافة حساب'}</h1>
                </div>
                <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    {/* الكود والاسم */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">الكود *</label>
                            <input value={data.code} onChange={e => setData('code', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                            {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code}</p>}
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">النوع *</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-1">الاسم *</label>
                        <input value={data.name} onChange={e => setData('name', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">الطبيعة *</label>
                            <select value={data.normal_balance} onChange={e => setData('normal_balance', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                <option value="debit">مدين</option>
                                <option value="credit">دائن</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">العملة</label>
                            <select value={data.currency_id} onChange={e => setData('currency_id', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                <option value="">عملة الشركة الافتراضية</option>
                                {currencies.map(c => (
                                    <option key={c.id} value={c.id}>{c.code} - {c.name} ({c.symbol})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-1">الحساب الأب</label>
                        <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                            <option value="">بدون حساب أب</option>
                            {parents.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                        </select>
                    </div>

                    {/* رصيد الافتتاح */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">رصيد الافتتاح</label>
                            <input type="number" value={data.opening_balance} min="0" step="0.01"
                                onChange={e => setData('opening_balance', +e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">تاريخ رصيد الافتتاح</label>
                            <input type="date" value={data.opening_balance_date}
                                onChange={e => setData('opening_balance_date', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_postable" checked={data.is_postable}
                            onChange={e => setData('is_postable', e.target.checked)} className="rounded" />
                        <label htmlFor="is_postable" className="text-sm text-slate-300 cursor-pointer">
                            قابل للترحيل (يقبل قيوداً)
                        </label>
                    </div>

                    <button type="submit" disabled={processing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Save size={16} /> {processing ? 'جارٍ الحفظ...' : 'حفظ'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
