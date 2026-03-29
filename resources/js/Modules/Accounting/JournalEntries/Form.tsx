import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, ArrowRight, Plus, Trash2 } from 'lucide-react';

interface Account { id: number; code: string; name: string; }

export default function JournalEntryForm({ accounts }: { accounts: Account[] }) {
    const { data, setData, post, processing, errors } = useForm({
        date:        new Date().toISOString().split('T')[0],
        description: '',
        reference:   '',
        lines: [
            { account_id: '', debit: 0, credit: 0, description: '' },
            { account_id: '', debit: 0, credit: 0, description: '' },
        ] as any[],
    });

    const addLine = () => setData('lines', [...data.lines, { account_id: '', debit: 0, credit: 0, description: '' }]);
    const removeLine = (i: number) => setData('lines', data.lines.filter((_: any, idx: number) => idx !== i));
    const updateLine = (i: number, key: string, val: any) => {
        const lines = [...data.lines];
        lines[i] = { ...lines[i], [key]: val };
        setData('lines', lines);
    };

    const totalDebit  = data.lines.reduce((s: number, l: any) => s + (+l.debit || 0), 0);
    const totalCredit = data.lines.reduce((s: number, l: any) => s + (+l.credit || 0), 0);
    const isBalanced  = Math.abs(totalDebit - totalCredit) < 0.01;

    return (
        <AppLayout>
            <Head title="قيد محاسبي جديد" />
            <div className="max-w-5xl space-y-4">
                <div className="flex items-center gap-3">
                    <a href="/journal-entries" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                    <h1 className="text-xl font-bold text-white">قيد محاسبي جديد</h1>
                </div>
                <form onSubmit={e => { e.preventDefault(); post('/journal-entries'); }} className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">التاريخ *</label>
                            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm text-slate-300 mb-1">الوصف *</label>
                            <input value={data.description} onChange={e => setData('description', e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-white font-medium">سطور القيد</h2>
                            <button type="button" onClick={addLine} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm">
                                <Plus size={14} /> إضافة سطر
                            </button>
                        </div>
                        <div className="grid grid-cols-12 gap-2 text-xs text-slate-400 px-1">
                            <div className="col-span-4">الحساب</div>
                            <div className="col-span-3">مدين</div>
                            <div className="col-span-3">دائن</div>
                            <div className="col-span-2"></div>
                        </div>
                        {data.lines.map((line: any, i: number) => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-4">
                                    <select value={line.account_id} onChange={e => updateLine(i, 'account_id', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">اختر حساب...</option>
                                        {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <input type="number" value={line.debit} min="0" step="0.01"
                                        onChange={e => updateLine(i, 'debit', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-3">
                                    <input type="number" value={line.credit} min="0" step="0.01"
                                        onChange={e => updateLine(i, 'credit', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    {data.lines.length > 2 && (
                                        <button type="button" onClick={() => removeLine(i)} className="text-slate-500 hover:text-red-400">
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(errors as any).lines && <p className="text-red-400 text-xs">{(errors as any).lines}</p>}
                        <div className="flex justify-end gap-8 pt-3 border-t border-slate-800 text-sm">
                            <span className="text-slate-400">إجمالي المدين: <span className="text-white font-medium">{totalDebit.toLocaleString()}</span></span>
                            <span className="text-slate-400">إجمالي الدائن: <span className="text-white font-medium">{totalCredit.toLocaleString()}</span></span>
                            <span className={isBalanced ? 'text-green-400' : 'text-red-400'}>
                                {isBalanced ? '✓ متوازن' : '✗ غير متوازن'}
                            </span>
                        </div>
                    </div>

                    <button type="submit" disabled={processing || !isBalanced}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm transition-colors">
                        <Save size={16} /> {processing ? 'جارٍ الحفظ...' : 'حفظ القيد'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
