import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from '@/Core/lib/toast';
import { PageProps } from '@/Core/types';

/**
 * يراقب flash messages من Laravel ويعرضها كـ toast تلقائياً
 * استخدمه في AppLayout مرة واحدة
 */
export function useFlashToast() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error)   toast.error(flash.error);
    }, [flash]);
}
