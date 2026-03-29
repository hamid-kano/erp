import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link } from '@inertiajs/react';
import { Plus, Pencil } from 'lucide-react';

interface Account {
    id: number; code: string; name: string;
    type: string; is_active: boolean;
    parent?: { name: string };
}

const typeMap: Record<string, { label: string; color: string }> = {
    asset:     { label: 'أصول',       color: 'text-blue-400' },
    liability: { label: 'خصوم',       color: 'text-red-400' },
    equity:    { label: 'حقوق ملكية', color: 'text-purple-400' },
    revenue:   { label: 'إيرادات',    color: 'text-green-400' },
    expense:   { label: 'مصروفات',    color: 'text-yellow-400' },
};

export default function AccountsIndex({ accounts }: { accounts: { data: Account[] } }) {
    return (
        <AppLayout>
            <Head title="الحسابات" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">دليل الحسابات</h1>
                    <Link href="/accounts/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> إضافة حساب
                    </Link>
                </div>
                <Flash />
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">الكود</th>
                                <th className="text-right px-4 py-3">الاسم</th>
                                <th className="text-right px-4 py-3">النوع</th>
                                <th className="text-right px-4 py-3">الحساب الأب</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {accounts.data.map(a => (
                                <tr key={a.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-blue-400 font-mono">{a.code}</td>
                                    <td className="px-4 py-3 text-white">{a.name}</td>
                                    <td className={`px-4 py-3 text-xs font-medium ${typeMap[a.type]?.color}`}>
                                        {typeMap[a.type]?.label}
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">{a.parent?.name || '-'}</td>
                                    <td className="px-4 py-3">
                                        <Link href={`/accounts/${a.id}/edit`} className="text-slate-400 hover:text-blue-400"><Pencil size={15} /></Link>
                                    </td>
                                </tr>
                            ))}
                            {accounts.data.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">لا توجد حسابات</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
