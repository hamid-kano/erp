import { cn } from '@/Core/lib/utils';
import { ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const variants: Record<Variant, string> = {
    default: 'bg-(--color-surface-2) text-(--color-text)',
    primary: 'bg-(--color-primary)/10 text-(--color-primary)',
    success: 'bg-(--color-success)/10 text-(--color-success)',
    warning: 'bg-(--color-warning)/10 text-(--color-warning)',
    danger:  'bg-(--color-danger)/10  text-(--color-danger)',
    info:    'bg-(--color-info)/10    text-(--color-info)',
};

const dotColors: Record<Variant, string> = {
    default: 'bg-(--color-text-muted)',
    primary: 'bg-(--color-primary)',
    success: 'bg-(--color-success)',
    warning: 'bg-(--color-warning)',
    danger:  'bg-(--color-danger)',
    info:    'bg-(--color-info)',
};

interface Props {
    children:   ReactNode;
    variant?:   Variant;
    dot?:       boolean;
    className?: string;
}

export default function Badge({ children, variant = 'default', dot = false, className }: Props) {
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold', variants[variant], className)}>
            {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
            {children}
        </span>
    );
}
