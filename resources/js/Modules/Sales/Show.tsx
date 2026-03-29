import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, router } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Truck, XCircle } from 'lucide-react';

interface Order {
    id: number; number: string; date: string; status: string; total: number;
    customer: { name: string; phone: string };
    warehouse: { name: string };
    items: { id: number; quantity: number; unit_price: number; product: { name: string } }[];
    invoice?: { number: string; total: number; status: string };
}

const statusMap: Record<string, { label: string; color: string }> = {
    draft:     { label: 'مسودة',  color: 'bg-slate-700 text-slate-300' },
    confirmed: { label: 'مؤكد',   color: 'bg-blue-500/10 text-blue-400' },
    shipped:   { label: 'مشحون',  color: 'bg-purple-500/10 text-purple-400' },
    completed: { label: 'مكتمل',  color: 'bg-green-500/10 text-green-400' },
    cancelled: { label: 'ملغي',   color: 'bg-red-500/10 text-red-400' },
};

export default function SalesShow({ order }: { order: Order }) {
    return (
        <AppLayout>
            <Head title={`أمر بيع ${order.number}`} />
            <div className="max-w-4xl space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href="/sales-orders" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                        <h1 className="text-xl font-bold text-white">{order.number}</h1>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusMap[order.status]?.color}`}>
                            {statusMap[order.status]?.label}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {order.status === 'draft' && (
                            <button onClick={() => router.post(`/sales-orders/${order.id}/confirm`)}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm">
                                <CheckCircle size={14} /> تأكيد
                            </button>
                        )}
                        {order.status === 'confirmed' && (
                            <button onClick={() => router.post(`/sales-orders/${order.id}/ship`)}
                                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm">
                                <Truck size={14} /> شحن وإصدار فاتورة
                            </button>
                        )}
                        {['draft', 'confirmed'].includes(order.status) && (
                            <button onClick={() => { if (confirm('إلغاء الطلب؟')) router.post(`/sales-orders/${order.id}/cancel`); }}
                                className="flex items-center gap-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 px-3 py-1.5 rounded-lg text-sm">
                                <XCircle size={14} /> إلغاء
                            </button>
                        )}
                    </div>
                </div>
                <Flash />
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'العميل', value: order.customer?.name },
                        { label: 'المستودع', value: order.warehouse?.name },
                        { label: 'التاريخ', value: order.date },
                    ].map(item => (
                        <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                            <p className="text-white font-medium">{item.value}</p>
                        </div>
                    ))}
                </div>
                {order.invoice && (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm font-medium">فاتورة: {order.invoice.number}</p>
                            <p className="text-slate-400 text-xs mt-0.5">الإجمالي: {Number(order.invoice.total).toLocaleString()} ر.س</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${order.invoice.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                            {order.invoice.status === 'paid' ? 'مدفوعة' : 'معلقة'}
                        </span>
                    </div>
                )}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">المنتج</th>
                                <th className="text-right px-4 py-3">الكمية</th>
                                <th className="text-right px-4 py-3">سعر البيع</th>
                                <th className="text-right px-4 py-3">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {order.items.map(item => (
                                <tr key={item.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-white">{item.product?.name}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.quantity}</td>
                                    <td className="px-4 py-3 text-slate-300">{Number(item.unit_price).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-white">{(item.quantity * item.unit_price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-slate-700">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-slate-400 text-right">الإجمالي</td>
                                <td className="px-4 py-3 text-white font-bold">{Number(order.total).toLocaleString()} ر.س</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
