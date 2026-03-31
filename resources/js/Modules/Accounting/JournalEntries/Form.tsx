import AppLayout from '@/Core/Layouts/AppLayout';
import { PageHeader, Card, PrimaryButton, InputField, Select } from '@/Core/Components/UI';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Account { id: number; code: string; name: string; }

interface JournalLine {
    account_id: number | '';
    debit:      number;
    credit:     number;
}

const emptyLine = (): JournalLine => ({ account_id: '', debit: 0, credit: 0 });

export default function JournalEntryForm({ accounts }: { accounts: Account[] }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        date:        new Date().toISOString().split('T')[0],
        description: '',
        reference:   '',
        lines:       [emptyLine(), emptyLine()] as JournalLine[],
    });

    const addLine    = () => setData('lines', [...data.lines, emptyLine()]);
    const removeLine = (i: number) => setData('lines', data.lines.filter((_, idx) => idx !== i));
    const updateLine = <K extends keyof JournalLine>(i: number, key: K, val: JournalLine[K]) => {
        const lines = [...data.lines];
        lines[i] = { ...lines[i], [key]: val };
        setData('lines', lines);
    };

    const totalDebit  = data.lines.reduce((s, l) => s + (+l.debit  || 0), 0);
    const totalCredit = data.lines.reduce((s, l) => s + (+l.credit || 0), 0);
    const isBalanced  = Math.abs(totalDebit - totalCredit) < 0.01;

    return (
        <AppLayout>
            <Head title="قيد محاسبي جديد" />
            <div className="max-w-5xl space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: t('nav.journalEntries'), href: '/journal-entries' }, { label: t('common.create') }]}
                    title="قيد محاسبي جديد"
                />
                <form onSubmit={e => { e.preventDefault(); post('/journal-entries'); }} className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-3 gap-4">
                            <InputField label={`${t('accounting.date')} *`} type="date" value={data.date}
                                onChange={e => setData('date', e.target.value)} />
                            <div className="col-span-2">
                                <InputField label={`${t('accounting.description')} *`} value={data.description}
                                    onChange={e => setData('description', e.target.value)} />
                            </div>
                        </div>
                    </Card>

                    <Card title="سطور القيد" action={
                        <button type="button" onClick={addLine} className="flex items-center gap-1 text-sm"
                            style={{ color: 'var(--color-primary)' }}>
                            <Plus size={14} /> إضافة سطر
                        </button>
                    }>
                        <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-2 text-xs px-1" style={{ color: 'var(--color-text-muted)' }}>
                                <div className="col-span-5">{t('accounting.accounts')}</div>
                                <div className="col-span-3">{t('accounting.debit')}</div>
                                <div className="col-span-3">{t('accounting.credit')}</div>
                                <div className="col-span-1"></div>
                            </div>
                            {data.lines.map((line, i) => (
                                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-5">
                                        <Select value={line.account_id} onChange={e => updateLine(i, 'account_id', e.target.value === '' ? '' : +e.target.value)}>
                                            <option value="">اختر حساب...</option>
                                            {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <InputField label="" type="number" value={line.debit} min="0" step="0.01"
                                            onChange={e => updateLine(i, 'debit', +e.target.value)} />
                                    </div>
                                    <div className="col-span-3">
                                        <InputField label="" type="number" value={line.credit} min="0" step="0.01"
                                            onChange={e => updateLine(i, 'credit', +e.target.value)} />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        {data.lines.length > 2 && (
                                            <button type="button" onClick={() => removeLine(i)}
                                                style={{ color: 'var(--color-text-muted)' }}>
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {errors.lines && (
                                <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.lines}</p>
                            )}
                            <div className="flex justify-end gap-8 pt-3 border-t text-sm" style={{ borderColor: 'var(--color-border)' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>
                                    {t('accounting.debit')}: <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{totalDebit.toLocaleString()}</span>
                                </span>
                                <span style={{ color: 'var(--color-text-muted)' }}>
                                    {t('accounting.credit')}: <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{totalCredit.toLocaleString()}</span>
                                </span>
                                <span style={{ color: isBalanced ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                    {isBalanced ? '✓ متوازن' : '✗ غير متوازن'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <PrimaryButton type="submit" loading={processing} disabled={!isBalanced}>
                        <Save size={15} /> حفظ القيد
                    </PrimaryButton>
                </form>
            </div>
        </AppLayout>
    );
}
