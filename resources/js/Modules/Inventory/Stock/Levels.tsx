import { Link } from '@inertiajs/react';
import { AlertTriangle, Package } from 'lucide-react';

interface Product {
    id: number; name: string; sku: string | null;
    reorder_point: number;
    unit: { symbol: string } | null;
}

interface Props {
    lowStock: Product[];
}

export default function StockLevels({ lowStock }: Props) {
    return (
        <div className="p-6 space-y-6" dir="rtl">
            <h1 className="text-2xl font-bold">مستويات المخزون</h1>

            {lowStock.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <Package className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-700 font-medium">جميع المنتجات فوق نقطة إعادة الطلب ✓</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b bg-amber-50 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h2 className="font-semibold text-amber-700">منتجات تحتاج إعادة طلب ({lowStock.length})</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-right px-4 py-3 font-medium text-gray-600">المنتج</th>
                                <th className="text-right px-4 py-3 font-medium text-gray-600">نقطة الطلب</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {lowStock.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium">{p.name}</p>
                                        {p.sku && <p className="text-xs text-gray-400 font-mono">{p.sku}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-amber-600 font-medium">
                                        {Number(p.reorder_point).toLocaleString()} {p.unit?.symbol}
                                    </td>
                                    <td className="px-4 py-3 text-left">
                                        <Link href={route('products.show', p.id)}
                                            className="text-blue-600 hover:underline text-xs">
                                            عرض التفاصيل
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
