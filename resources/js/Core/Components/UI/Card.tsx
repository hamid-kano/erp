import { cn } from '@/Core/lib/utils';
import { ReactNode } from 'react';

interface Props {
    title?:         ReactNode;
    subtitle?:      string;
    action?:        ReactNode;
    footer?:        ReactNode;
    children:       ReactNode;
    className?:     string;
    bodyClassName?: string;
}

export default function Card({ title, subtitle, action, footer, children, className, bodyClassName }: Props) {
    return (
        <div className={cn('bg-(--color-surface) border border-(--color-border) rounded-xl shadow-sm', className)}>
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border)">
                    <div>
                        {title && <h3 className="text-[14px] font-semibold text-(--color-text-strong)">{title}</h3>}
                        {subtitle && <p className="text-[12px] text-(--color-text-muted) mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            <div className={cn('p-5', bodyClassName)}>{children}</div>
            {footer && (
                <div className="px-5 py-3 border-t border-(--color-border) bg-(--color-surface-2) rounded-b-xl text-[12px] text-(--color-text-muted)">
                    {footer}
                </div>
            )}
        </div>
    );
}
