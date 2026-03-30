import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { StatCard, DataTableCard, Badge, PageHeader } from '@/Core/Components/UI';
import {
    TrendingUp, Package, Users, Warehouse,
    ShoppingCart, FileText, AlertCircle,
    ArrowDownCircle, ArrowUpCircle,
} from 'lucide-react';

interface Stats {
    customers: number; suppliers: number; items: number; warehouses: number;
    sales_orders: number; purchase_orders: number; revenue: number;
    pending_invoices: number; payments_in: number; payments_out: number;
}

interface Order {
    id: number; number: string; date: string; total: number; status: string;
    customer?: { name: string }; supplier?: { name: string };
}

const statusVariant: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    draft:     'default',
    confirmed: 'primary',
    shipped:   'info',
    completed: 'success',
    received:  'success',
    cancelled: 'danger',
};

export default function Dashboard({ stats, recentSales, recentPurchases }: {
    stats: Stats;
    recentSales: Order[];
    recentPurchases: Order[];
}) {
    const { t } = useTranslation();

    const salesColumns = [
        { key: 'number',   label: '#',          render: (v: string) => <span className="font-mono text-blue-400 text-xs">{v}</span> },
        { key: 'customer', label: t('crm.customers'), render: (_: any, row: Order) => row.customer?.name ?? '—' },
        { key: 'total',    label: t('accounting.balance'), render: (v: number) => `${Number(v).toLocaleString()} ر.س` },
        { key: 'status',   label: t('common.status'), render: (v: string) => <Badge variant={statusVariant[v] ?? 'default'} dot>{t(`sales.statuses.${v}`) }</Badge> },
    ];

    const purchaseColumns = [
        { key: 'number',   label: '#',          render: (v: string) => <span className="font-mono text-blue-400 text-xs">{v}</span> },
        { key: 'supplier', label: t('crm.suppliers'), render: (_: any, row: Order) => row.supplier?.name ?? '—' },
        { key: 'total',    label: t('accounting.balance'), render: (v: number) => `${Number(v).toLocaleString()} ر.س` },
        { key: 'status',   label: t('common.status'), render: (v: string) => <Badge variant={statusVariant[v] ?? 'default'} dot>{t(`sales.statuses.${v}`)}</Badge> },
    ];

    return (
        <AppLayout>
            <Head title={t('dashboard.title')} />
            <div className="space-y-6">
                <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard icon={Users}       label={t('dashboard.totalCustomers')}  value={stats.customers}       iconClass="bg-blue-500/10 text-blue-400" />
                    <StatCard icon={Users}       label={t('dashboard.totalSuppliers')}  value={stats.suppliers}       iconClass="bg-purple-500/10 text-purple-400" />
                    <StatCard icon={Package}     label={t('dashboard.totalItems')}      value={stats.items}           iconClass="bg-green-500/10 text-green-400" />
                    <StatCard icon={Warehouse}   label={t('dashboard.totalWarehouses')} value={stats.warehouses}      iconClass="bg-yellow-500/10 text-yellow-400" />
                    <StatCard icon={TrendingUp}  label={t('sales.orders')}              value={stats.sales_orders}    iconClass="bg-cyan-500/10 text-cyan-400" />
                    <StatCard icon={ShoppingCart}label={t('purchasing.orders')}         value={stats.purchase_orders} iconClass="bg-orange-500/10 text-orange-400" />
                    <StatCard icon={AlertCircle} label={t('dashboard.pendingInvoices')} value={stats.pending_invoices}iconClass="bg-red-500/10 text-red-400" />
                    <StatCard icon={FileText}    label={t('dashboard.revenue')}         value={`${Number(stats.revenue).toLocaleString()} ر.س`} iconClass="bg-emerald-500/10 text-emerald-400" />
                </div>

                {/* Payments */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <ArrowDownCircle size={20} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">{t('payments.in')}</p>
                            <p className="text-green-400 font-bold text-lg">{Number(stats.payments_in).toLocaleString()} ر.س</p>
                        </div>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <ArrowUpCircle size={20} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">{t('payments.out')}</p>
                            <p className="text-red-400 font-bold text-lg">{Number(stats.payments_out).toLocaleString()} ر.س</p>
                        </div>
                    </div>
                </div>

                {/* Recent Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <DataTableCard
                        title={t('dashboard.recentSales')}
                        columns={salesColumns}
                        data={recentSales}
                        action={<Link href="/sales-orders" className="text-blue-400 hover:text-blue-300 text-xs">عرض الكل</Link>}
                        emptyText={t('common.noData')}
                    />
                    <DataTableCard
                        title={t('dashboard.recentPurchases')}
                        columns={purchaseColumns}
                        data={recentPurchases}
                        action={<Link href="/purchase-orders" className="text-blue-400 hover:text-blue-300 text-xs">عرض الكل</Link>}
                        emptyText={t('common.noData')}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
