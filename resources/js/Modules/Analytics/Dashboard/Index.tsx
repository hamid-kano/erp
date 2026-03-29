import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    TrendingUp, Package, Users, Warehouse,
    ShoppingCart, CreditCard, FileText, ArrowUpCircle,
    ArrowDownCircle, AlertCircle,
} from 'lucide-react';

interface Stats {
    customers: number; suppliers: number; products: number; warehouses: number;
    sales_orders: number; purchase_orders: number; revenue: number;
    pending_invoices: number; payments_in: number; payments_out: number;
}

interface Order {
    id: number; number: string; date: string; total: number; status: string;
    customer?: { name: string }; supplier?: { name: string };
}

const statusColors: Record<string, string> = {
    draft:     'bg-slate-700 text-slate-300',
    confirmed: 'bg-blue-500/10 text-blue-400',
    shipped:   'bg-purple-500/10 text-purple-400',
    completed: 'bg-green-500/10 text-green-400',
    received:  'bg-green-500/10 text-green-400',
    cancelled: 'bg-red-500/10 text-red-400',
};

const statusLabels: Record<string, string> = {
    draft: 'مسودة', confirmed: 'مؤكد', shipped: 'مشحون',
    completed: 'مكتمل', received: 'مستلم', cancelled: 'ملغي',
};

export default function Dashboard({ stats, recentSales, recentPurchases }: {
    stats: Stats;
    recentSales: Order[];
    recentPurchases: Order[];
}) {
    const statCards = [
        { label: 'العملاء',        value: stats.customers,       icon: <Users size={18} />,        color: 'text-blue-400',   bg: 'bg-blue-500/10',   href: '/customers' },
        { label: 'الموردون',       value: stats.suppliers,       icon: <Users size={18} />,        color: 'text-purple-400', bg: 'bg-purple-500/10', href: '/suppliers' },
        { label: 'المنتجات',       value: stats.products,        icon: <Package size={18} />,      color: 'text-green-400',  bg: 'bg-green-500/10',  href: '/products' },
        { label: 'المستودعات',     value: stats.warehouses,      icon: <Warehouse size={18} />,    color: 'text-yellow-400', bg: 'bg-yellow-500/10', href: '/warehouses' },
        { label: 'أوامر البيع',    value: stats.sales_orders,    icon: <TrendingUp size={18} />,   color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   href: '/sales-orders' },
        { label: 'أوامر الشراء',   value: stats.purchase_orders, icon: <ShoppingCart size={18} />, color: 'text-orange-400', bg: 'bg-orange-500/10', href: '/purchase-orders' },
        { label: 'فواتير معلقة',   value: stats.pending_invoices,icon: <AlertCircle size={18} />,  color: 'text-red-400',    bg: 'bg-red-500/10',    href: '/sales-orders' },
        { label: 'الإيرادات',      value: `${Number(stats.revenue).toLocaleString()} ر.س`, icon: <FileText size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', href: '/sales-orders' },
    ];

    return (
        <AppLayout>
            <Head title="لوحة القيادة" />
            <div className="space-y-6">
                <h1 className="text-xl font-bold text-white">لوحة القيادة</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {statCards.map(card => (
                        <Link key={card.label} href={card.href}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors group">
                            <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                                {card.icon}
                            </div>
                            <p className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {card.value}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">{card.label}</p>
                        </Link>
                    ))}
                </div>

                {/* Payments Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <ArrowDownCircle size={20} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">إجمالي المقبوضات</p>
                            <p className="text-green-400 font-bold text-lg">{Number(stats.payments_in).toLocaleString()} ر.س</p>
                        </div>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <ArrowUpCircle size={20} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs">إجمالي المدفوعات</p>
                            <p className="text-red-400 font-bold text-lg">{Number(stats.payments_out).toLocaleString()} ر.س</p>
                        </div>
                    </div>
                </div>

                {/* Recent Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Recent Sales */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-white font-medium text-sm">آخر أوامر البيع</h2>
                            <Link href="/sales-orders" className="text-blue-400 hover:text-blue-300 text-xs">عرض الكل</Link>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-800">
                                {recentSales.length === 0 ? (
                                    <tr><td className="px-4 py-6 text-center text-slate-500 text-xs">لا توجد بيانات</td></tr>
                                ) : recentSales.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-2.5">
                                            <p className="text-blue-400 font-mono text-xs">{o.number}</p>
                                            <p className="text-slate-400 text-xs">{o.customer?.name}</p>
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <p className="text-white text-xs">{Number(o.total).toLocaleString()} ر.س</p>
                                            <span className={`px-1.5 py-0.5 rounded text-xs ${statusColors[o.status]}`}>
                                                {statusLabels[o.status]}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Purchases */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-white font-medium text-sm">آخر أوامر الشراء</h2>
                            <Link href="/purchase-orders" className="text-blue-400 hover:text-blue-300 text-xs">عرض الكل</Link>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-800">
                                {recentPurchases.length === 0 ? (
                                    <tr><td className="px-4 py-6 text-center text-slate-500 text-xs">لا توجد بيانات</td></tr>
                                ) : recentPurchases.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-2.5">
                                            <p className="text-blue-400 font-mono text-xs">{o.number}</p>
                                            <p className="text-slate-400 text-xs">{o.supplier?.name}</p>
                                        </td>
                                        <td className="px-4 py-2.5 text-right">
                                            <p className="text-white text-xs">{Number(o.total).toLocaleString()} ر.س</p>
                                            <span className={`px-1.5 py-0.5 rounded text-xs ${statusColors[o.status]}`}>
                                                {statusLabels[o.status]}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
