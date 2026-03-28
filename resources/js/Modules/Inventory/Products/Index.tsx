import { Link, router } from '@inertiajs/react';
import { PaginatedData } from '@/Core/types';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

interface Category { id: number; name: string; }
interface Unit { id: number; name: string; symbol: string; }
interface Product {
    id: number;
    name: string;
    sku: string | null;
    cost_price: number;
    sell_price: number;
    reorder_point: number;
    is_active: boolean;
    category: Category | null;
    unit: Unit | null;
}

interface Props {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: { search?: string; category_id?: string };
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('products.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`هل تريد حذف المنتج "${name}"؟`)) {
            router.delete(route('products.destroy', id));
        }
    };

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">المنتجات</h1>
                <Link
                    href={route('products.create')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> منتج جديد
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="بحث بالاسم أو الكود..."
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                        <Search className="w-4 h-4" />
                    </button>
                </form>
                <select
                    value={filters.category_id ?? ''}
                    onChange={(e) => router.get(route('products.index'), { ...filters, category_id: e.target.value })}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">كل الفئات</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">المنتج</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الكود</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الفئة</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">سعر التكلفة</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">سعر البيع</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">نقطة الطلب</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.data.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-12 text-gray-400">لا يوجد منتجات</td>
                            </tr>
                        ) : products.data.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 font-medium">{product.name}</td>
                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku ?? '-'}</td>
                                <td className="px-4 py-3 text-gray-600">{product.category?.name ?? '-'}</td>
                                <td className="px-4 py-3">{Number(product.cost_price).toLocaleString()}</td>
                                <td className="px-4 py-3">{Number(product.sell_price).toLocaleString()}</td>
                                <td className="px-4 py-3">{Number(product.reorder_point).toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.is_active ? 'نشط' : 'موقوف'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Link href={route('products.show', product.id)} className="text-gray-500 hover:text-gray-700">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link href={route('products.edit', product.id)} className="text-blue-600 hover:text-blue-800">
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(product.id, product.name)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {products.last_page > 1 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>إجمالي: {products.total} منتج</span>
                    <div className="flex gap-1">
                        {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => router.get(route('products.index'), { ...filters, page })}
                                className={`px-3 py-1 rounded ${page === products.current_page ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
