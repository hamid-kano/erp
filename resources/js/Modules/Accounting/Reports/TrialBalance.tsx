import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField } from '@/Core/Components/UI';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccountRow {
    id: number; code: string; name: string; type: string;
    normal_balance: string; depth: number;
    opening_balance: number; debit: number; credit: number; closing_balance: number;
}

const typeLabels: Record<string, string> = {
    asset: 'أصول', liability: 'خصوم', equity: 'حقوق ملكية',
    revenue: 'إيرادات', expense: 'مصاريف',
};
const typeColors: Record<string, string> = {
    asset: 'var(--color-info)', liability: 'var(--color-danger)',
    equity: 'var(--color-secondary)', revenue: 'var(--color-success)', expense: 'var(--color-warning)',
};

const headers = ['الكود', 'اسم الحساب', 'النوع', 'رصيد أول المدة', 'مدين', 'دائن', 'رصيد آخر المدة'];

export default function TrialBalance({ accounts, total_debit, total_credit, is_balanced, from, to }: {
    accounts: AccountRow[]; total_debit: number; total_credit: number;
    is_balanced: boolean; from: string; to: string;
}) {
    const { t } = useTranslation();
    const [fromDate, setFromDate] = useState(from);
    const [toDate,   setToDate]   = useState(to);

    const fmt = (n: number) => Number(n).toLocaleString('ar', { minimumFractionDigits: 2 });
    const balanceCell = (n: number) => (
        <span className="font-mono text-xs font-medium"
            style={{ color: n >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {fmt(Math.abs(n))}{n < 0 && <span className="mr-1 text-xs">(د)</span>}
        </span>
    );

    const totalOpening = accounts.reduce((s, a) => s + a.opening_balance, 0);
    const totalClosing = accounts.reduce((s, a) => s + a.closing_balance, 0);

    return (
        <AppLayout>
            <Head title={t('nav.trialBalance')} />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: t('nav.trialBalance') }]}
                    title={t('nav.trialBalance')}
                    actions={
                        is_balanced
                            ? <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-success)' }}><CheckCircle size={15} /> متوازن</span>
                            : <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-danger)' }}><XCircle size={15} /> غير متوازن</span>
                    }
                />

                <Card bodyClassName="py-4">
                    <div className="flex items-end gap-4">
                        <InputField label="من تاريخ" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                        <InputField label="إلى تاريخ" type="date" value={toDate}   onChange={e => setToDate(e.target.value)} />
                        <PrimaryButton onClick={() => router.get('/reports/trial-balance', { from: fromDate, to: toDate }, { preserveState: true })}>
                            عرض
                        </PrimaryButton>
                    </div>
                </Card>

                <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    <table className="w-full text-sm">
                        <thead style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                            <tr>
                                {headers.map(h => (
                                    <th key={h} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                                        style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                        لا توجد قيود في هذه الفترة
                                    </td>
                                </tr>
                            ) : accounts.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '')}>
                                    <td className="px-4 py-2.5">
                                        <span className="font-mono text-xs" style={{ color: 'var(--color-primary)' }}>{a.code}</span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-1" style={{ paddingRight: `${a.depth * 12}px` }}>
                                            {a.depth > 0 && <ChevronRight size={11} style={{ color: 'var(--color-text-muted)' }} className="shrink-0" />}
                                            <span className={a.depth === 0 ? 'font-semibold' : ''} style={{ color: 'var(--color-text-strong)' }}>{a.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-xs font-medium" style={{ color: typeColors[a.type] }}>
                                        {typeLabels[a.type]}
                                    </td>
                                    <td className="px-4 py-2.5">{balanceCell(a.opening_balance)}</td>
                                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--color-text)' }}>
                                        {a.debit > 0 ? fmt(a.debit) : '—'}
                                    </td>
                                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--color-text)' }}>
                                        {a.credit > 0 ? fmt(a.credit) : '—'}
                                    </td>
                                    <td className="px-4 py-2.5">{balanceCell(a.closing_balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ borderTop: '2px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                            <tr>
                                <td colSpan={3} className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--color-text-strong)' }}>الإجمالي</td>
                                <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--color-text-strong)' }}>{fmt(totalOpening)}</td>
                                <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--color-text-strong)' }}>{fmt(total_debit)}</td>
                                <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--color-text-strong)' }}>{fmt(total_credit)}</td>
                                <td className="px-4 py-3">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                                        style={{
                                            background: is_balanced ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: is_balanced ? 'var(--color-success)' : 'var(--color-danger)',
                                        }}>
                                        {fmt(totalClosing)}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
