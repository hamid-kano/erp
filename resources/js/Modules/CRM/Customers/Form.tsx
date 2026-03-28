import { useForm, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Customer {
    id?: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    credit_limit: number;
}

interface Props {
    customer?: Customer;
}

export default function CustomerForm({ customer }: Props) {
    const isEdit = !!customer;

    const { data, setData, post, put, processing, errors } = useForm({
        name:         customer?.name ?? '',
        phone:        customer?.phone ?? '',
        email:        customer?.email ?? '',
        address:      customer?.address ?? '',
        credit_limit: customer?.credit_limit ?? 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit
            ? put(route('customers.update', customer!.id))
            : post(route('customers.store'));
    };

    return (
        <div className="p-6 max-w-2xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Link href={route('customers.index')} className="text-gray-500 hover:text-gray-700">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">{isEdit ? 'تعديل العميل' : 'عميل جديد'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم *</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <textarea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        rows={3}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Credit Limit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">حد الائتمان</label>
                    <input
                        type="number"
                        value={data.credit_limit}
                        onChange={(e) => setData('credit_limit', Number(e.target.value))}
                        min={0}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {processing ? 'جاري الحفظ...' : isEdit ? 'تحديث' : 'حفظ'}
                    </button>
                    <Link
                        href={route('customers.index')}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        إلغاء
                    </Link>
                </div>
            </form>
        </div>
    );
}
