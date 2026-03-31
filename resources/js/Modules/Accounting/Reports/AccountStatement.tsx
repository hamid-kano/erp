import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Party  { id: number; name: string; }

interface StatementLine {
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
    party: { id: number; name: string; type: string; };
    opening_balance: number;
    closing_balance: number;
    total_debit: number;
    total_credit: number;
    lines: StatementLine[];
    from: string;
    to: string;
}

interface Filters { partyType: string; partyId: number; from: string; to: string; }

export default function AccountStatement({ customers, suppliers, report, filters }: {
    customers: Party[];
    suppliers: Party[];
    report: Report | null;
    filters: Filters;
}) {
    const { t } = useTranslation();
    const [partyType, setPartyType] = useState(filters.partyType ?? 'customer');
    const [partyId,   setPartyId]   = useState(filters.partyId?.toString() ?? '');
    const [from,      setFrom]      = useState(filters.from);
    const [to,        setTo]        = useState(filters.to);

    const parties = partyType === 'supplier' ? suppliers : customers;

    const fmt = (n: number) => Number(Math.abs(n)).toLocaleString('ar', { minimumFractionDigits: 2 });
    const balanceColor = (n: number) => n >= 0 ? 'var(--color-success)' : 'var(--color-danger)';

    const search = () => {
        if (!partyId) return;
        router.get('/reports/account-statement', { party_type: partyType, party_id: partyId, from, to }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="كشف حساب" />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: 'كشف حساب' }]}
                    title="كشف حساب"
                />

                {/* فلاتر */}
                <Card bodyClassName="py-4">
                    <div className="flex items-end gap-4 flex-wrap">
                        <div>
                            <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>نوع الطرف</label>
                            <Select value={partyType} onChange={e => { setPartyType(e.target.value); setPartyId(''); }}>
                                <option value="customer">عميل</option>
                                <option value="supplier">مورد</option>
                            </Select>
                        </div>
                        <div className="min-w-56">
                            <label className="block text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                {partyType === 'supplier' ? 'المورد' : 'العميل'} *
                            </label>
                            <Select value={partyId} onChange={e => setPartyId(e.target.value)}>
                                <option value="">اختر...</option>
                                {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </Select>
                        </div>
                        <InputField label="من تاريخ" type="date" value={from} onChange={e => setFrom(e.target.value)} />
                        <InputField label="إلى تاريخ" type="date" value={to}   onChange={e => setTo(e.target.value)} />
                        <PrimaryButton onClick={search} disabled={!partyId}>عرض</PrimaryButton>
                    </div>
                </Card>

                {report && (
                    <>
                        {/* ملخص */}
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: 'رصيد أول المدة', value: report.opening_balance, color: balanceColor(report.opening_balance) },
                                { label: 'إجمالي المدين',  value: report.total_debit,     color: 'var(--color-success)' },
                                { label: 'إجمالي الدائن',  value: report.total_credit,    color: 'var(--color-danger)' },
                                { label: 'رصيد آخر المدة', value: report.closing_balance, color: balanceColor(report.closing_balance) },
                            ].map(item => (
                                <div key={item.label} className="rounded-xl border p-4"
                                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                    <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{item.label}</p>
                                    <p className="font-mono font-bold text-base" style={{ color: item.color }}>
                                        {fmt(item.value)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* الجدول */}
                        <div className="rounded-xl border overflow-hidden"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                            <div className="px-4 py-3 font-semibold text-sm border-b"
                                style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-strong)' }}>
                                {report.party.name}
                            </div>
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
                                        <td /><td />
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
                                            {fmt(report.total_debit)}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: 'var(--color-danger)' }}>
                                            {fmt(report.total_credit)}
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
