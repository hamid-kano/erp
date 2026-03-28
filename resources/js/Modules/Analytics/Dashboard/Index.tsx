import { Link } from '@inertiajs/react';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const modules = [
        { title: 'العملاء', icon: <Users className="w-8 h-8" />, href: route('customers.index'), color: 'bg-blue-500' },
        { title: 'الموردين', icon: <Users className="w-8 h-8" />, href: route('suppliers.index'), color: 'bg-purple-500' },
        { title: 'المنتجات', icon: <Package className="w-8 h-8" />, href: '#', color: 'bg-green-500' },
        { title: 'المبيعات', icon: <ShoppingCart className="w-8 h-8" />, href: '#', color: 'bg-orange-500' },
    ];

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {modules.map((m) => (
                    <Link
                        key={m.title}
                        href={m.href}
                        className="bg-white rounded-xl border shadow-sm p-6 flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className={`${m.color} text-white p-3 rounded-xl`}>{m.icon}</div>
                        <span className="font-medium text-gray-700">{m.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
