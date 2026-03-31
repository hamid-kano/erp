import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

interface Account { id: number; code: string; name: string; }

interface LedgerLine {
    id: number;
    date: string;
    number: string;
    description: string;
    reference: string | null;
    debit: number;
    credit: number;
    running_balance: number;
}

interface Report {
    account: { id: number; code: string; name: string; type: string; normal_balance: string; };
    opening_balance: number;
    closing_balance: number;
    lines: LedgerLine[];
    from: string;
    to: string;
}

interface Filters { accountId: number; from: string; to: string; }

export default function GeneralLedger({ accounts, report, filters }: {
    accounts: Account[];
    report: Report | null;
    filters: Filters;
}) {
    const { t } = useTranslation();
    const [accountId, setAccountId] = useState(filters.accountId?.toString() ?? '');
    const [from,      setFrom]      = useState(filters.from);
    const [to,        setTo]        = useState(filters.to);

    const fmt = (n: number) => Number(Math.abs(n)).toLocaleString('ar', { minimumFractionDigits: 2 });
    const balanceColor = (n: number) => n >= 0 ? 'var(--color-success)' : 'var(--color-danger)';

    const search = () => {
        if (!accountId) return;
        router.get('/reports/general-ledger', { account_id: accountId, from, to }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="دفتر الأستاذ" />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: 'دفتر الأستاذ' }]}
                    title="دفتر الأستاذ"
                />

                {/* فلاتر البحث */}
                <Card bodyClassName="py-4">
                    <div className="flex items-end gap-4 flex-wrap">
                        <div className="min-w-64">
                            <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>الحساب *</label>
                            <Select value={accountId} onChange={e => setAccountId(e.target.value)}>
                                <option value="">اختر حساباً...</option>
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                                ))}
                            </Select>
                        </div>
                        <InputField label="من تاريخ" type="date" value={from} onChange={e => setFrom(e.target.value)} />
                        <InputField label="إلى تاريخ" type="date" value={to}   onChange={e => setTo(e.target.value)} />
                        <PrimaryButton onClick={search} disabled={!accountId}>عرض</PrimaryButton>
                    </div>
                </Card>

                {report && (
                    <>
                        {/* معلومات الحساب */}
                        <div className="flex items-center gap-2 px-1">
                            <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                                {report.account.code}
                            </span>
                            <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                            <span className="font-semibold" style={{ color: 'var(--color-text-strong)' }}>
                                {report.account.name}
                            </span>
                        </div>

                        {/* الجدول */}
                        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                            <table className="w-full text-sm">
                                <thead style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                                    <tr>
                                        {['التاريخ', 'رقم القيد', 'البيان', 'المرجع', 'مدين', 'دائن', 'الرصيد'].map(h => (
                                            <th key={h} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                                                style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* رصيد أول المدة */}
                                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>{report.from}</td>
                                        <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                                            رصيد أول المدة
                                        </td>
                                        <td className="px-4 py-2.5" />
                                        <td className="px-4 py-2.5" />
                                        <td className="px-4 py-2.5 font-mono text-xs font-bold"
                                            style={{ color: balanceColor(report.opening_balance) }}>
                                            {fmt(report.opening_balance)}
                                        </td>
                                    </tr>

                                    {report.lines.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-10 text-center text-sm"
                                                style={{ color: 'var(--color-text-muted)' }}>
                                                لا توجد حركات في هذه الفترة
                                            </td>
                                        </tr>
                                    ) : report.lines.map(line => (
                                        <tr key={line.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = '')}>
                                            <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                {String(line.date)}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                <a href={`/journal-entries/${line.id}`}
                                                    className="font-mono text-xs font-medium hover:underline"
                                                    style={{ color: 'var(--color-primary)' }}>
                                                    {line.number}
                                                </a>
                                            </td>
                                            <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--color-text-strong)' }}>
                                                {line.description}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                {line.reference ?? '—'}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--color-success)' }}>
                                                {line.debit > 0 ? fmt(line.debit) : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--color-danger)' }}>
                                                {line.credit > 0 ? fmt(line.credit) : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-xs font-medium"
                                                style={{ color: balanceColor(line.running_balance) }}>
                                                {fmt(line.running_balance)}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* رصيد آخر المدة */}
                                    <tr style={{ borderTop: '2px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>{report.to}</td>
                                        <td colSpan={3} className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--color-text-strong)' }}>
                                            رصيد آخر المدة
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: 'var(--color-success)' }}>
                                            {fmt(report.lines.reduce((s, l) => s + l.debit, 0))}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: 'var(--color-danger)' }}>
                                            {fmt(report.lines.reduce((s, l) => s + l.credit, 0))}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-xs"
                                            style={{ color: balanceColor(report.closing_balance) }}>
                                            {fmt(report.closing_balance)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
