import { Link } from '@inertiajs/react';
import { ArrowRight, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { PaginatedData } from '@/Core/types';

interface Product {
    id: number; name: string; sku: string | null;
    cost_price: number; sell_price: number;
    category: { name: string } | null;
    unit: { name: string; symbol: string } | null;
}

interface Movement {
    id: number; quantity: number; type: string;
    unit_cost: number; created_at: string;
}

interface Props {
    product: Product;
    movements: PaginatedData<Movement>;
}

const typeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    in:         { label: 'وارد',    color: 'text-green-600 bg-green-50',  icon: <TrendingUp className="w-4 h-4" /> },
    out:        { label: 'صادر',    color: 'text-red-600 bg-red-50',      icon: <TrendingDown className="w-4 h-4" /> },
    adjustment: { label: 'تسوية',   color: 'text-blue-600 bg-blue-50',    icon: <RefreshCw className="w-4 h-4" /> },
    transfer:   { label: 'تحويل',   color: 'text-purple-600 bg-purple-50', icon: <RefreshCw className="w-4 h-4" /> },
};

export default function ProductShow({ product, movements }: Props) {
    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex items-center gap-3">
                <Link href={route('products.index')} className="text-gray-500 hover:text-gray-700">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                {product.sku && <span className="text-gray-400 font-mono text-sm">#{product.sku}</span>}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'الفئة',        value: product.category?.name ?? '-' },
                    { label: 'وحدة القياس',  value: product.unit ? `${product.unit.name} (${product.unit.symbol})` : '-' },
                    { label: 'سعر التكلفة',  value: Number(product.cost_price).toLocaleString() },
                    { label: 'سعر البيع',    value: Number(product.sell_price).toLocaleString() },
                ].map((item) => (
                    <div key={item.label} className="bg-white rounded-xl border shadow-sm p-4">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Movements */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50">
                    <h2 className="font-semibold">حركات المخزون</h2>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">النوع</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الكمية</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">سعر الوحدة</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">التاريخ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {movements.data.length === 0 ? (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-400">لا توجد حركات</td></tr>
                        ) : movements.data.map((m) => {
                            const cfg = typeConfig[m.type] ?? typeConfig.adjustment;
                            return (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                                            {cfg.icon} {cfg.label}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3 font-medium ${Number(m.quantity) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {Number(m.quantity) >= 0 ? '+' : ''}{Number(m.quantity).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">{Number(m.unit_cost).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(m.created_at).toLocaleDateString('ar')}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
