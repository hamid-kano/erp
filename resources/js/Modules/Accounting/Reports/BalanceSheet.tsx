import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField } from '@/Core/Components/UI';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccountRow { id: number; code: string; name: string; depth: number; balance: number; }

export default function BalanceSheet({ assets, liabilities, equity, retained_earnings, total_assets, total_liabilities, total_equity, is_balanced, as_of }: {
    assets: AccountRow[]; liabilities: AccountRow[]; equity: AccountRow[];
    retained_earnings: number;
    total_assets: number; total_liabilities: number; total_equity: number;
    is_balanced: boolean; as_of: string;
}) {
    const { t } = useTranslation();
    const [asOfDate, setAsOfDate] = useState(as_of);
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
                            <td className="px-4 py-2.5 text-left font-mono text-xs font-medium" style={{ color: 'var(--color-text-strong)' }}>
                                {fmt(row.balance)}
                            </td>
                        </tr>
                    ))}
                    {/* صافي الأرباح المتراكمة ضمن حقوق الملكية */}
                    {title === 'حقوق الملكية' && (
                        <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(16,185,129,0.04)' }}>
                            <td className="px-4 py-2.5">
                                <span className="text-xs mr-2 font-mono" style={{ color: 'var(--color-primary)' }}>—</span>
                                <span style={{ color: 'var(--color-text-strong)' }}>الأرباح المتراكمة</span>
                            </td>
                            <td className="px-4 py-2.5 text-left font-mono text-xs font-medium"
                                style={{ color: retained_earnings >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                {fmt(retained_earnings)}
                            </td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr style={{ borderTop: '2px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                        <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--color-text-strong)' }}>إجمالي {title}</td>
                        <td className="px-4 py-3 font-mono font-bold text-left" style={{ color }}>{fmt(total)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );

    return (
        <AppLayout>
            <Head title="الميزانية العمومية" />
            <div className="space-y-4 max-w-3xl">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: 'الميزانية العمومية' }]}
                    title="الميزانية العمومية"
                    actions={
                        is_balanced
                            ? <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-success)' }}><CheckCircle size={15} /> متوازنة</span>
                            : <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-danger)' }}><XCircle size={15} /> غير متوازنة</span>
                    }
                />

                <Card bodyClassName="py-4">
                    <div className="flex items-end gap-4">
                        <InputField label="بتاريخ" type="date" value={asOfDate} onChange={e => setAsOfDate(e.target.value)} />
                        <PrimaryButton onClick={() => router.get('/reports/balance-sheet', { as_of: asOfDate }, { preserveState: true })}>
                            عرض
                        </PrimaryButton>
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                    <Section title="الأصول"       rows={assets}      total={total_assets}      color="var(--color-info)" />
                    <Section title="الخصوم"       rows={liabilities} total={total_liabilities} color="var(--color-danger)" />
                    <Section title="حقوق الملكية" rows={equity}      total={total_equity}      color="var(--color-secondary)" />
                </div>

                {/* معادلة الميزانية */}
                <div className="rounded-xl border p-4 flex items-center justify-between text-sm"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                        الأصول <strong style={{ color: 'var(--color-info)' }}>{fmt(total_assets)}</strong>
                        {' = '}
                        الخصوم <strong style={{ color: 'var(--color-danger)' }}>{fmt(total_liabilities)}</strong>
                        {' + '}
                        حقوق الملكية <strong style={{ color: 'var(--color-secondary)' }}>{fmt(total_equity)}</strong>
                    </span>
                    <span style={{ color: is_balanced ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {is_balanced ? '✓ متوازنة' : '✗ غير متوازنة'}
                    </span>
                </div>
            </div>
        </AppLayout>
    );
}
