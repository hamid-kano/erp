import { toast as sonnerToast } from 'sonner';

export const toast = {
    success: (msg: string) => sonnerToast.success(msg),
    error:   (msg: string) => sonnerToast.error(msg),
    warning: (msg: string) => sonnerToast.warning(msg),
    info:    (msg: string) => sonnerToast.info(msg),

    /**
     * للعمليات الـ async — يعرض loading ثم success/error
     * @example
     * toast.promise(saveItem(), { loading: 'جاري الحفظ...', success: 'تم الحفظ', error: 'فشل الحفظ' })
     */
    promise: <T>(
        promise: Promise<T>,
        msgs: { loading: string; success: string; error: string }
    ) => sonnerToast.promise(promise, msgs),

    dismiss: sonnerToast.dismiss,
};
