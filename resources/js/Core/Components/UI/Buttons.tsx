import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/Core/lib/utils';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export function PrimaryButton({ className, disabled, loading, children, ...props }: Props) {
    return (
        <button {...props} disabled={disabled || loading}
            className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60', className)}
            style={{ background: 'var(--color-primary)' }}>
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {children}
        </button>
    );
}

export function SecondaryButton({ className, disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} disabled={disabled}
            className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-60', className)}
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-strong)' }}>
            {children}
        </button>
    );
}

export function DangerButton({ className, disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} disabled={disabled}
            className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60', className)}
            style={{ background: 'var(--color-danger)' }}>
            {children}
        </button>
    );
}
