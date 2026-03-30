import { cn } from '@/Core/lib/utils';
import { ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const variants: Record<Variant, string> = {
    default: 'bg-slate-700 text-slate-300',
    primary: 'bg-blue-500/10 text-blue-400',
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-400',
    danger:  'bg-red-500/10 text-red-400',
    info:    'bg-purple-500/10 text-purple-400',
};

const dotColors: Record<Variant, string> = {
    default: 'bg-slate-400',
    primary: 'bg-blue-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger:  'bg-red-400',
    info:    'bg-purple-400',
};

interface Props {
    children:   ReactNode;
    variant?:   Variant;
    dot?:       boolean;
    className?: string;
}

export default function Badge({ children, variant = 'default', dot = false, className }: Props) {
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
            {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
            {children}
        </span>
    );
}
