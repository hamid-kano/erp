import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, DataTableCard, Badge, PrimaryButton, Select } from '@/Core/Components/UI';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Pencil, Lock, ChevronRight, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Account {
    id: number; code: string; name: string; type: string;
    normal_balance: string; is_postable: boolean;
    is_locked: boolean; is_active: boolean; depth: number;
}
interface Template { id: number; name: string; }

const typeColors: Record<string, string> = {
    asset: 'var(--color-info)', liability: 'var(--color-danger)',
    equity: 'var(--color-secondary)', revenue: 'var(--color-success)', expense: 'var(--color-warning)',
};
const typeLabels: Record<string, string> = {
    asset: 'أصول', liability: 'خصوم', equity: 'حقوق ملكية', revenue: 'إيرادات', expense: 'مصاريف',
};

function SetupTemplate({ templates }: { templates: Template[] }) {
    const { data, setData, post, processing } = useForm({ template_id: '' });
    return (
        <div className="rounded-xl border p-8 text-center max-w-lg mx-auto"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <BookOpen size={40} className="mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-strong)' }}>إعداد شجرة الحسابات</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>اختر قالباً جاهزاً للبدء.</p>
            <form onSubmit={e => { e.preventDefault(); post('/accounts/setup-template'); }} className="space-y-4">
                <Select value={data.template_id} onChange={e => setData('template_id', e.target.value)}>
                    <option value="">اختر قالباً...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
                <PrimaryButton type="submit" loading={processing} disabled={!data.template_id} className="w-full justify-center">
                    إنشاء شجرة الحسابات
                </PrimaryButton>
            </form>
        </div>
    );
}

export default function AccountsIndex({ accounts, hasAccounts, templates }: {
    accounts: Account[]; hasAccounts: boolean; templates: Template[];
}) {
    const { t } = useTranslation();

    const columns = [
        { key: 'code', label: t('accounting.reference'),
            render: (v: string) => <span className="font-mono text-xs" style={{ color: 'var(--color-primary)' }}>{v}</span>
        },
        { key: 'name', label: t('crm.name'), render: (v: string, row: Account) => (
            <div className="flex items-center gap-1" style={{ paddingRight: `${row.depth * 16}px` }}>
                {row.depth > 0 && <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} className="shrink-0" />}
                <span className={row.depth === 0 ? 'font-semibold' : ''} style={{ color: 'var(--color-text-strong)' }}>{v}</span>
                {row.is_locked && <Lock size={11} className="mr-1" style={{ color: 'var(--color-text-muted)' }} />}
            </div>
        )},
        { key: 'type', label: 'النوع',
            render: (v: string) => <span className="text-xs font-medium" style={{ color: typeColors[v] }}>{typeLabels[v]}</span>
        },
        { key: 'normal_balance', label: 'الطبيعة',
            render: (v: string) => <Badge variant={v === 'debit' ? 'success' : 'danger'}>{v === 'debit' ? 'مدين' : 'دائن'}</Badge>
        },
        { key: 'is_postable', label: 'نوع الحساب',
            render: (v: boolean) => <Badge variant={v ? 'primary' : 'default'}>{v ? 'قابل للترحيل' : 'تجميعي'}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: Account) => (
            !row.is_locked && (
                <Link href={`/accounts/${row.id}/edit`} style={{ color: 'var(--color-text-muted)' }}><Pencil size={14} /></Link>
            )
        )},
    ];

    return (
        <AppLayout>
            <Head title="دليل الحسابات" />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: t('nav.accounting') }, { label: t('nav.accounts') }]}
                    title="دليل الحسابات"
                    actions={hasAccounts && (
                        <Link href="/accounts/create">
                            <PrimaryButton><Plus size={16} /> إضافة حساب</PrimaryButton>
                        </Link>
                    )}
                />
                <Flash />
                {!hasAccounts
                    ? <SetupTemplate templates={templates} />
                    : <DataTableCard title="الحسابات" columns={columns} data={accounts} emptyText={t('common.noData')} />
                }
            </div>
        </AppLayout>
    );
}
