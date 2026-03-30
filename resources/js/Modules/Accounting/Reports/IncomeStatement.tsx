import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField } from '@/Core/Components/UI';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccountRow { id: number; code: string; name: string; depth: number; amount: number; }

export default function IncomeStatement({ revenue, expense, total_revenue, total_expense, net_income, is_profit, from, to }: {
    revenue: AccountRow[]; expense: AccountRow[];
    total_revenue: number; total_expense: number;
    net_income: number; is_profit: boolean;
    from: string; to: string;
}) {
    const { t } = useTranslation();
    const [fromDate, setFromDate] = useState(from);
    const [toDate,   setToDate]   = useState(to);
    const fmt = (n: number) => Number(Math.abs(n)).toLocaleString('ar', { minimumFractionDigits: 2 });

    const Section = ({ title, rows, total, color }: { title: string; rows: AccountRow[]; total: number; color: string }) => (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <div className="px-4 py-3 font-semibold text-sm" style={{ background: 'var(--color-surface-2)', color }}>
                {title}
            </div>
            <table className="w-full text-sm">
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                            onMouseLeave={e => (e.currentTarget.style.background = '')}>
                            <td className="px-4 py-2.5">
                                <div className="flex items-center gap-1" style={{ paddingRight: `${row.depth * 12}px` }}>
                                    {row.depth > 0 && <ChevronRight size={11} style={{ color: 'var(--color-text-muted)' }} />}
                                    <span className="font-mono text-xs mr-2" style={{ color: 'var(--color-primary)' }}>{row.code}</span>
                                    <span style={{ color: 'var(--color-text-strong)' }}>{row.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2.5 text-left font-mono text-xs font-medium" style={{ color }}>
                                {fmt(row.amount)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ borderTop: '2px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                        <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--color-text-strong)' }}>الإجمالي</td>
                        <td className="px-4 py-3 font-mono font-bold text-left" style={{ color }}>{fmt(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );

    return (
        <AppLayout>
            <Head title="قائمة الدخل" />
            <div className="space-y-4 max-w-3xl">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: 'قائمة الدخل' }]}
                    title="قائمة الدخل"
                    actions={
                        <span className="flex items-center gap-1 text-sm font-medium"
                            style={{ color: is_profit ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {is_profit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {is_profit ? 'ربح' : 'خسارة'}
                        </span>
                    }
                />

                <Card bodyClassName="py-4">
                    <div className="flex items-end gap-4">
                        <InputField label="من تاريخ" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                        <InputField label="إلى تاريخ" type="date" value={toDate}   onChange={e => setToDate(e.target.value)} />
                        <PrimaryButton onClick={() => router.get('/reports/income-statement', { from: fromDate, to: toDate }, { preserveState: true })}>
                            عرض
                        </PrimaryButton>
                    </div>
                </Card>

                <Section title="الإيرادات" rows={revenue} total={total_revenue} color="var(--color-success)" />
                <Section title="المصاريف"  rows={expense} total={total_expense} color="var(--color-danger)" />

                {/* صافي الدخل */}
                <div className="rounded-xl border p-5 flex items-center justify-between"
                    style={{
                        background: is_profit ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                        borderColor: is_profit ? 'var(--color-success)' : 'var(--color-danger)',
                    }}>
                    <span className="font-bold text-base" style={{ color: 'var(--color-text-strong)' }}>
                        {is_profit ? 'صافي الربح' : 'صافي الخسارة'}
                    </span>
                    <span className="font-mono font-bold text-lg"
                        style={{ color: is_profit ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {fmt(net_income)}
                    </span>
                </div>
            </div>
        </AppLayout>
    );
}
