import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { PageProps } from '@/Core/types';

export default function Flash() {
    const { flash } = usePage<PageProps>().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => { setVisible(true); }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    const isSuccess = !!flash.success;

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-4 text-sm ${isSuccess ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {isSuccess ? <CheckCircle size={16} /> : <XCircle size={16} />}
            <span className="flex-1">{flash.success || flash.error}</span>
            <button onClick={() => setVisible(false)}><X size={14} /></button>
        </div>
    );
}
