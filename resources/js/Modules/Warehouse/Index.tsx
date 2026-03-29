import AppLayout from '@/Core/Layouts/AppLayout';
import Flash from '@/Core/Components/Flash';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Warehouse, Eye } from 'lucide-react';

interface WarehouseItem {
    id: number; name: string; city: string;
    is_active: boolean; locations_count: number;
}

export default function WarehouseIndex({ warehouses }: { warehouses: { data: WarehouseItem[] } }) {
    return (
        <AppLayout>
            <Head title="المستودعات" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">المستودعات</h1>
                    <Link href="/warehouses/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        <Plus size={16} /> إضافة مستودع
                    </Link>
                </div>
                <Flash />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {warehouses.data.map(w => (
                        <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                                    <Warehouse size={18} className="text-blue-400" />
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${w.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {w.is_active ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                            <h3 className="text-white font-semibold">{w.name}</h3>
                            <p className="text-slate-400 text-sm mt-1">{w.city || 'غير محدد'}</p>
                            <p className="text-slate-500 text-xs mt-2">{w.locations_count} موقع</p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                                <Link href={`/warehouses/${w.id}`} className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs">
                                    <Eye size={13} /> عرض
                                </Link>
                                <Link href={`/warehouses/${w.id}/edit`} className="flex items-center gap-1 text-slate-400 hover:text-blue-400 text-xs">
                                    <Pencil size={13} /> تعديل
                                </Link>
                                <button onClick={() => { if (confirm('حذف المستودع؟')) router.delete(`/warehouses/${w.id}`); }}
                                    className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-xs mr-auto">
                                    <Trash2 size={13} /> حذف
                                </button>
                            </div>
                        </div>
                    ))}
                    {warehouses.data.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-slate-500">لا توجد مستودعات</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
