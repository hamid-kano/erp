import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Pencil, Lock, ChevronRight, BookOpen } from 'lucide-react';

interface Account {
    id: number; code: string; name: string; type: string;
    normal_balance: string; is_postable: boolean;
    is_locked: boolean; is_active: boolean;
    depth: number; parent_code: string | null;
}

interface Template { id: number; name: string; description: string; }

const typeColors: Record<string, string> = {
    asset:     'text-blue-400',
    liability: 'text-red-400',
    equity:    'text-purple-400',
    revenue:   'text-green-400',
    expense:   'text-yellow-400',
};

const typeLabels: Record<string, string> = {
    asset: 'أصول', liability: 'خصوم', equity: 'حقوق ملكية',
    revenue: 'إيرادات', expense: 'مصاريف',
};

function SetupTemplate({ templates }: { templates: Template[] }) {
    const { data, setData, post, processing } = useForm({ template_id: '' });

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center max-w-lg mx-auto">
            <BookOpen size={40} className="text-blue-400 mx-auto mb-4" />
            <h2 className="text-white font-bold text-lg mb-2">إعداد شجرة الحسابات</h2>
            <p className="text-slate-400 text-sm mb-6">
                لم يتم إعداد شجرة الحسابات بعد. اختر قالباً جاهزاً للبدء.
            </p>
            <form onSubmit={e => { e.preventDefault(); post('/accounts/setup-template'); }} className="space-y-4">
                <select value={data.template_id} onChange={e => setData('template_id', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                    <option value="">اختر قالباً...</option>
                    {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
                <button type="submit" disabled={processing || !data.template_id}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm transition-colors">
                    {processing ? 'جارٍ الإنشاء...' : 'إنشاء شجرة الحسابات'}
                </button>
            </form>
        </div>
    );
}

export default function AccountsIndex({ accounts, hasAccounts, templates }: {
    accounts: Account[];
    hasAccounts: boolean;
    templates: Template[];
}) {
    return (
        <AppLayout>
            <Head title="دليل الحسابات" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">دليل الحسابات</h1>
                    {hasAccounts && (
                        <Link href="/accounts/create"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            <Plus size={16} /> إضافة حساب
                        </Link>
                    )}
                </div>
                <Flash />

                {!hasAccounts ? (
                    <SetupTemplate templates={templates} />
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-800">
                                <tr className="text-slate-400">
                                    <th className="text-right px-4 py-3">الكود</th>
                                    <th className="text-right px-4 py-3">الاسم</th>
                                    <th className="text-right px-4 py-3">النوع</th>
                                    <th className="text-right px-4 py-3">الاتجاه</th>
                                    <th className="text-right px-4 py-3">نوع الحساب</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {accounts.map(a => (
                                    <tr key={a.id} className={`hover:bg-slate-800/50 ${!a.is_active ? 'opacity-50' : ''}`}>
                                        <td className="px-4 py-2.5">
                                            <span className="text-blue-400 font-mono text-xs">{a.code}</span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-1"
                                                style={{ paddingRight: `${a.depth * 16}px` }}>
                                                {a.depth > 0 && <ChevronRight size={12} className="text-slate-600 shrink-0" />}
                                                <span className={`text-white ${a.depth === 0 ? 'font-semibold' : ''}`}>
                                                    {a.name}
                                                </span>
                                                {a.is_locked && <Lock size={11} className="text-slate-500 mr-1" />}
                                            </div>
                                        </td>
                                        <td className={`px-4 py-2.5 text-xs font-medium ${typeColors[a.type]}`}>
                                            {typeLabels[a.type]}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${a.normal_balance === 'debit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {a.normal_balance === 'debit' ? 'مدين' : 'دائن'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${a.is_postable ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                                                {a.is_postable ? 'قابل للترحيل' : 'تجميعي'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            {!a.is_locked && (
                                                <Link href={`/accounts/${a.id}/edit`}
                                                    className="text-slate-400 hover:text-blue-400">
                                                    <Pencil size={14} />
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
