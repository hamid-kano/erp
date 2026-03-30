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
        <div className={cn('rounded-xl border shadow-sm', className)}
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                        {title && <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-strong)' }}>{title}</h3>}
                        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            <div className={cn('p-5', bodyClassName)}>{children}</div>
            {footer && (
                <div className="px-5 py-3 border-t rounded-b-xl text-xs"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                    {footer}
                </div>
            )}
        </div>
    );
}
