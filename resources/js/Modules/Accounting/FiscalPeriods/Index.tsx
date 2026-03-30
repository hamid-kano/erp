import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { PageHeader, Card, DataTableCard, Badge, PrimaryButton, InputField } from '@/Core/Components/UI';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Lock } from 'lucide-react';
import { useState } from 'react';

interface FiscalPeriod {
    id: number; name: string;
    start_date: string; end_date: string;
    status: 'open' | 'closed'; closed_at: string | null;
}

function CreateForm({ onCancel }: { onCancel: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', start_date: '', end_date: '',
    });

    return (
        <Card title="فترة مالية جديدة">
            <form onSubmit={e => { e.preventDefault(); post('/fiscal-periods'); }} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <InputField label="الاسم *" placeholder="مثال: 2025-Q1"
                        value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                    <InputField label="من تاريخ *" type="date"
                        value={data.start_date} onChange={e => setData('start_date', e.target.value)} error={errors.start_date} />
                    <InputField label="إلى تاريخ *" type="date"
                        value={data.end_date} onChange={e => setData('end_date', e.target.value)} error={errors.end_date} />
                </div>
                <div className="flex gap-3">
                    <PrimaryButton type="submit" loading={processing}>حفظ</PrimaryButton>
                    <button type="button" onClick={onCancel} className="text-sm px-4 py-2 rounded-lg border"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                        إلغاء
                    </button>
                </div>
            </form>
        </Card>
    );
}

export default function FiscalPeriodsIndex({ periods }: { periods: FiscalPeriod[] }) {
    const [showForm, setShowForm] = useState(false);

    const columns = [
        { key: 'name',       label: 'الفترة',     render: (v: string) => <span className="font-medium" style={{ color: 'var(--color-text-strong)' }}>{v}</span> },
        { key: 'start_date', label: 'من تاريخ' },
        { key: 'end_date',   label: 'إلى تاريخ' },
        { key: 'status',     label: 'الحالة',
            render: (v: string) => <Badge variant={v === 'open' ? 'success' : 'default'} dot>{v === 'open' ? 'مفتوحة' : 'مغلقة'}</Badge>
        },
        { key: 'id', label: '', render: (_: any, row: FiscalPeriod) => (
            row.status === 'open' && (
                <button
                    onClick={() => {
                        if (confirm(`هل تريد إغلاق الفترة "${row.name}"؟ لن تتمكن من الترحيل فيها بعد ذلك.`)) {
                            router.post(`/fiscal-periods/${row.id}/close`);
                        }
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                    style={{ color: 'var(--color-danger)', background: 'rgba(239,68,68,0.08)' }}>
                    <Lock size={12} /> إغلاق
                </button>
            )
        )},
    ];

    return (
        <AppLayout>
            <Head title="الفترات المالية" />
            <div className="space-y-4">
                <PageHeader
                    breadcrumbs={[{ label: 'المحاسبة' }, { label: 'الفترات المالية' }]}
                    title="الفترات المالية"
                    actions={!showForm && (
                        <PrimaryButton onClick={() => setShowForm(true)}>
                            <Plus size={16} /> فترة جديدة
                        </PrimaryButton>
                    )}
                />
                <Flash />
                {showForm && <CreateForm onCancel={() => setShowForm(false)} />}
                <DataTableCard title="الفترات" columns={columns} data={periods} emptyText="لا توجد فترات مالية بعد" />
            </div>
        </AppLayout>
    );
}
