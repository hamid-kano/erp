import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';

interface Item {
    id: number; name: string; sku: string | null;
    reorder_point: number; unit: { symbol: string } | null;
}

export default function StockLevels({ lowStock }: { lowStock: Item[] }) {
    return (
        <AppLayout>
            <Head title="مستويات المخزون" />
            <div className="space-y-4">
                <h1 className="text-xl font-bold text-white">مستويات المخزون</h1>

                {lowStock.length === 0 ? (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-10 text-center">
                        <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                        <p className="text-green-400 font-medium">جميع الأصناف فوق نقطة إعادة الطلب ✓</p>
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2 bg-yellow-500/5">
                            <AlertTriangle size={16} className="text-yellow-400" />
                            <h2 className="text-yellow-400 font-medium text-sm">
                                أصناف تحتاج إعادة طلب ({lowStock.length})
                            </h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-800">
                                <tr className="text-slate-400">
                                    <th className="text-right px-4 py-3">الصنف</th>
                                    <th className="text-right px-4 py-3">نقطة الطلب</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {lowStock.map(i => (
                                    <tr key={i.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Package size={15} className="text-slate-500" />
                                                <div>
                                                    <p className="text-white font-medium">{i.name}</p>
                                                    {i.sku && <p className="text-slate-500 font-mono text-xs">{i.sku}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-yellow-400 font-medium">
                                            {Number(i.reorder_point).toLocaleString()} {i.unit?.symbol}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link href={`/items/${i.id}`}
                                                className="text-blue-400 hover:text-blue-300 text-xs">
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
        </AppLayout>
    );
}
