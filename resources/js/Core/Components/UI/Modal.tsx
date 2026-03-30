import { PropsWithChildren } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/Core/lib/utils';

const maxWidthClass = {
    sm:  'max-w-sm',
    md:  'max-w-md',
    lg:  'max-w-lg',
    xl:  'max-w-xl',
    '2xl': 'max-w-2xl',
};

interface Props {
    show:       boolean;
    onClose:    () => void;
    title?:     string;
    maxWidth?:  keyof typeof maxWidthClass;
    closeable?: boolean;
}

export default function Modal({
    show, onClose, title, maxWidth = 'md', closeable = true, children,
}: PropsWithChildren<Props>) {
    if (!show) return null;

    const handleBackdrop = () => { if (closeable) onClose(); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[modalIn_0.15s_ease]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleBackdrop} />

            {/* Panel */}
            <div className={cn('relative w-full rounded-2xl border shadow-xl z-10', maxWidthClass[maxWidth])}
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

                {/* Header */}
                {(title || closeable) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b"
                        style={{ borderColor: 'var(--color-border)' }}>
                        {title && (
                            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-strong)' }}>
                                {title}
                            </h2>
                        )}
                        {closeable && (
                            <button onClick={onClose}
                                className="ms-auto grid place-items-center w-7 h-7 rounded-lg transition-colors hover:bg-(--color-surface-2)"
                                style={{ color: 'var(--color-text-muted)' }}>
                                <X size={15} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
