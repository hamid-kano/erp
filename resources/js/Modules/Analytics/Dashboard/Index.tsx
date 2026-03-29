import AppLayout from '@/Core/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { TrendingUp, Package, Users, CreditCard } from 'lucide-react';

const stats = [
    { label: 'إجمالي المبيعات', value: '0', icon: <TrendingUp size={20} />, color: 'text-blue-400' },
    { label: 'المنتجات', value: '0', icon: <Package size={20} />, color: 'text-green-400' },
    { label: 'العملاء', value: '0', icon: <Users size={20} />, color: 'text-purple-400' },
    { label: 'المدفوعات', value: '0', icon: <CreditCard size={20} />, color: 'text-yellow-400' },
];

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="لوحة القيادة" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">لوحة القيادة</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                            <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-center py-8">
                        سيتم عرض الرسوم البيانية هنا بعد إضافة البيانات
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
