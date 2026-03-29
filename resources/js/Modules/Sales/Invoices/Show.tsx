import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Invoice {
    id: number; number: string; date: string; due_date: string;
    status: string; total: number; total_base: number; paid: number; cogs: number;
    notes: string | null; exchange_rate: number;
    customer: { name: string; phone?: string };
    currency: { code: string; symbol: string } | null;
    order: { number: string } | null;
    items: { id: number; quantity: number; unit_price: number; total: number; product: { name: string; sku: string } }[];
}

const statusMap: Record<string, { label: string; color: string }> = {
    draft:     { label: 'مسودة',   color: 'bg-slate-700 text-slate-300' },
    issued:    { label: 'مُصدرة',  color: 'bg-blue-500/10 text-blue-400' },
    partial:   { label: 'جزئي',    color: 'bg-yellow-500/10 text-yellow-400' },
    paid:      { label: 'مدفوعة',  color: 'bg-green-500/10 text-green-400' },
    cancelled: { label: 'ملغية',   color: 'bg-red-500/10 text-red-400' },
};

export default function SalesInvoiceShow({ invoice }: { invoice: Invoice }) {
    const sym     = invoice.currency?.symbol ?? '';
    const balance = invoice.total - invoice.paid;
    const profit  = invoice.total_base - invoice.cogs;

    return (
        <AppLayout>
            <Head title={`فاتورة ${invoice.number}`} />
            <div className="max-w-4xl space-y-4">
                <div className="flex items-center gap-3">
                    <a href="/sales-invoices" className="text-slate-400 hover:text-white"><ArrowRight size={18} /></a>
                    <h1 className="text-xl font-bold text-white">{invoice.number}</h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusMap[invoice.status]?.color}`}>
                        {statusMap[invoice.status]?.label}
                    </span>
                </div>
                <Flash />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'العميل',          value: invoice.customer?.name },
                        { label: 'تاريخ الفاتورة',  value: invoice.date },
                        { label: 'تاريخ الاستحقاق', value: invoice.due_date || '-' },
                        { label: 'أمر البيع',        value: invoice.order?.number || 'مباشر' },
                    ].map(item => (
                        <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                            <p className="text-white font-medium">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Items */}
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
                            {invoice.items.map(item => (
                                <tr key={item.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 text-white">{item.product?.name}</td>
                                    <td className="px-4 py-3 text-slate-300">{item.quantity}</td>
                                    <td className="px-4 py-3 text-slate-300">{sym} {Number(item.unit_price).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-white">{sym} {Number(item.total).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-slate-700 text-sm">
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-slate-400 text-right">الإجمالي</td>
                                <td className="px-4 py-2 text-white font-bold">{sym} {Number(invoice.total).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-slate-400 text-right">المدفوع</td>
                                <td className="px-4 py-2 text-green-400">{sym} {Number(invoice.paid).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-slate-400 text-right">المتبقي</td>
                                <td className={`px-4 py-2 font-bold ${balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {sym} {Number(balance).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Profit Summary */}
                {invoice.cogs > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-slate-400 text-xs mb-1">تكلفة البضاعة (COGS)</p>
                            <p className="text-white font-medium">{Number(invoice.cogs).toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-slate-400 text-xs mb-1">الإيراد (بالعملة الأساسية)</p>
                            <p className="text-white font-medium">{Number(invoice.total_base).toLocaleString()}</p>
                        </div>
                        <div className={`border rounded-xl p-4 ${profit >= 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <p className="text-slate-400 text-xs mb-1">هامش الربح</p>
                            <p className={`font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {Number(profit).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {invoice.notes && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <p className="text-slate-400 text-xs mb-1">ملاحظات</p>
                        <p className="text-slate-300 text-sm">{invoice.notes}</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
