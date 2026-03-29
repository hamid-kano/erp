import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number; name: string; sku: string | null;
    cost_price: number; sell_price: number;
    is_active: boolean; category?: { name: string };
}

export default function ProductsIndex({ products, categories, filters }: {
    products: { data: Product[]; total: number; last_page: number; current_page: number };
    categories: { id: number; name: string }[];
    filters: { search?: string; category_id?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <AppLayout>
            <Head title="المنتجات" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">المنتجات</h1>
                    <Link href="/products/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> منتج جديد
                    </Link>
                </div>
                <Flash />
                <div className="flex gap-3">
                    <form onSubmit={e => { e.preventDefault(); router.get('/products', { search }, { preserveState: true }); }} className="relative flex-1">
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الكود..."
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-blue-500" />
                    </form>
                    <select value={filters.category_id ?? ''} onChange={e => router.get('/products', { ...filters, category_id: e.target.value })}
                        className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                        <option value="">كل الفئات</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-800">
                            <tr className="text-slate-400">
                                <th className="text-right px-4 py-3">المنتج</th>
                                <th className="text-right px-4 py-3">الكود</th>
                                <th className="text-right px-4 py-3">الفئة</th>
                                <th className="text-right px-4 py-3">سعر التكلفة</th>
                                <th className="text-right px-4 py-3">سعر البيع</th>
                                <th className="text-right px-4 py-3">الحالة</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.data.map(p => (
                                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.sku || '-'}</td>
                                    <td className="px-4 py-3 text-slate-300">{p.category?.name || '-'}</td>
                                    <td className="px-4 py-3 text-slate-300">{Number(p.cost_price).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-slate-300">{Number(p.sell_price).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${p.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {p.is_active ? 'نشط' : 'موقوف'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Link href={`/products/${p.id}`} className="text-slate-400 hover:text-slate-200"><Eye size={15} /></Link>
                                            <Link href={`/products/${p.id}/edit`} className="text-slate-400 hover:text-blue-400"><Pencil size={15} /></Link>
                                            <button onClick={() => { if (confirm('حذف المنتج؟')) router.delete(`/products/${p.id}`); }}
                                                className="text-slate-400 hover:text-red-400"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">لا يوجد منتجات</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
