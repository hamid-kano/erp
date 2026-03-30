import AppLayout from '@/Core/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, TrendingUp, TrendingDown, RefreshCw, Pencil } from 'lucide-react';

interface Item {
    id: number; name: string; sku: string | null;
    item_type: string; cost_price: number; sell_price: number;
    item_group: { name: string } | null;
    unit: { name: string; symbol: string } | null;
}

interface Movement {
    id: number; quantity: number; type: string;
    unit_cost: number; created_at: string;
}

const itemTypeLabels: Record<string, string> = {
    raw_material: 'مادة خام', finished_good: 'منتج نهائي',
    service: 'خدمة', asset: 'أصل',
};

const typeConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    in:         { label: 'وارد',  color: 'bg-green-500/10 text-green-400',   icon: <TrendingUp size={13} /> },
    out:        { label: 'صادر',  color: 'bg-red-500/10 text-red-400',       icon: <TrendingDown size={13} /> },
    adjustment: { label: 'تسوية', color: 'bg-blue-500/10 text-blue-400',     icon: <RefreshCw size={13} /> },
    transfer:   { label: 'تحويل', color: 'bg-purple-500/10 text-purple-400', icon: <RefreshCw size={13} /> },
};

export default function ItemShow({ item, movements }: {
    item: Item;
    movements: { data: Movement[]; total: number };
}) {
    return (
        <AppLayout>
            <Head title={item.name} />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/items" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></Link>
                        <h1 className="text-xl font-bold text-white">{item.name}</h1>
                        {item.sku && <span className="text-slate-500 font-mono text-sm">#{item.sku}</span>}
                    </div>
                    <Link href={`/items/${item.id}/edit`}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors">
                        <Pencil size={14} /> تعديل
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'المجموعة',    value: item.item_group?.name ?? '-' },
                        { label: 'نوع الصنف',   value: itemTypeLabels[item.item_type] ?? item.item_type },
                        { label: 'سعر التكلفة', value: `${Number(item.cost_price).toLocaleString()} ر.س` },
                        { label: 'سعر البيع',   value: `${Number(item.sell_price).toLocaleString()} ر.س` },
                    ].map(card => (
                        <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-slate-400 text-xs mb-1">{card.label}</p>
                            <p className="text-white font-semibold">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-white font-medium">حركات المخزون</h2>
                        <span className="text-slate-400 text-xs">{movements.total} حركة</span>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">النوع</th>
                                <th className="text-right px-4 py-3">الكمية</th>
                                <th className="text-right px-4 py-3">سعر الوحدة</th>
                                <th className="text-right px-4 py-3">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {movements.data.length === 0 ? (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">لا توجد حركات</td></tr>
                            ) : movements.data.map(m => {
                                const cfg = typeConfig[m.type] ?? typeConfig.adjustment;
                                return (
                                    <tr key={m.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${cfg.color}`}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 font-medium ${Number(m.quantity) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {Number(m.quantity) >= 0 ? '+' : ''}{Number(m.quantity).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{Number(m.unit_cost).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-slate-400">{new Date(m.created_at).toLocaleDateString('ar')}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
