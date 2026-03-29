import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, ArrowRight } from 'lucide-react';

interface Account { id?: number; code: string; name: string; type: string; parent_id?: number; }
interface Option { id: number; code: string; name: string; }

const types = [
    { value: 'asset',     label: 'أصول' },
    { value: 'liability', label: 'خصوم' },
    { value: 'equity',    label: 'حقوق ملكية' },
    { value: 'revenue',   label: 'إيرادات' },
    { value: 'expense',   label: 'مصروفات' },
];

export default function AccountForm({ account, parents }: { account?: Account; parents: Option[] }) {
    const { data, setData, post, put, processing, errors } = useForm({
        code:      account?.code ?? '',
        name:      account?.name ?? '',
        type:      account?.type ?? 'asset',
        parent_id: account?.parent_id ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        account?.id ? put(`/accounts/${account.id}`) : post('/accounts');
    };

    return (
        <AppLayout>
            <Head title={account ? 'تعديل حساب' : 'إضافة حساب'} />
            <div className="max-w-lg space-y-4">
                <div className="flex items-center gap-3">
                    <a href="/accounts" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                    <h1 className="text-xl font-bold text-white">{account ? 'تعديل حساب' : 'إضافة حساب'}</h1>
                </div>
                <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
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
                    <div>
                        <label className="block text-sm text-slate-300 mb-1">الحساب الأب</label>
                        <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                            <option value="">بدون حساب أب</option>
                            {parents.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                        </select>
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
