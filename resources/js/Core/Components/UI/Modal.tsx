import { cn } from '@/Core/lib/utils';
import { PropsWithChildren } from 'react';
import { X } from 'lucide-react';

const maxWidthClass = {
    sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl',
};

interface Props {
    show:       boolean;
    onClose:    () => void;
    title?:     string;
    maxWidth?:  keyof typeof maxWidthClass;
    closeable?: boolean;
}

export default function Modal({ show, onClose, title, maxWidth = 'md', closeable = true, children }: PropsWithChildren<Props>) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[modalIn_0.15s_ease]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => closeable && onClose()} />
            <div className={cn('relative w-full rounded-2xl border border-(--color-border) shadow-xl z-10 bg-(--color-surface)', maxWidthClass[maxWidth])}>
                {(title || closeable) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
                        {title && <h2 className="text-[15px] font-semibold text-(--color-text-strong)">{title}</h2>}
                        {closeable && (
                            <button onClick={onClose}
                                className="ms-auto grid place-items-center w-7 h-7 rounded-lg border-none bg-transparent text-(--color-text-muted) hover:bg-(--color-surface-2) transition-colors cursor-pointer">
                                <X size={15} />
                            </button>
                        )}
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
