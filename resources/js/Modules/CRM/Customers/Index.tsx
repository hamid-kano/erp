import { Link, router } from '@inertiajs/react';
import { PaginatedData } from '@/Core/types';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    balance: number;
    credit_limit: number;
    is_active: boolean;
}

interface Props {
    customers: PaginatedData<Customer>;
    filters: { search?: string };
}

export default function CustomersIndex({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('customers.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`هل تريد حذف العميل "${name}"؟`)) {
            router.delete(route('customers.destroy', id));
        }
    };

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">العملاء</h1>
                <Link
                    href={route('customers.create')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    عميل جديد
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="بحث باسم العميل..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Search className="w-4 h-4" />
                </button>
            </form>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الاسم</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الهاتف</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">البريد</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الرصيد</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">حد الائتمان</th>
                            <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {customers.data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                    لا يوجد عملاء
                                </td>
                            </tr>
                        ) : (
                            customers.data.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium">{customer.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{customer.phone ?? '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{customer.email ?? '-'}</td>
                                    <td className="px-4 py-3">{Number(customer.balance).toLocaleString()}</td>
                                    <td className="px-4 py-3">{Number(customer.credit_limit).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {customer.is_active ? 'نشط' : 'موقوف'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Link href={route('customers.edit', customer.id)} className="text-blue-600 hover:text-blue-800">
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => handleDelete(customer.id, customer.name)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {customers.last_page > 1 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>إجمالي: {customers.total} عميل</span>
                    <div className="flex gap-1">
                        {Array.from({ length: customers.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => router.get(route('customers.index'), { ...filters, page })}
                                className={`px-3 py-1 rounded ${page === customers.current_page ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
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
