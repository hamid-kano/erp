import { cn } from '@/Core/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

export function PrimaryButton({ className, disabled, loading, children, ...props }: Props) {
    return (
        <button {...props} disabled={disabled || loading}
            className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed bg-(--color-primary)', className)}>
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />}
            {children}
        </button>
    );
}

export function SecondaryButton({ className, disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} disabled={disabled}
            className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium border border-(--color-border) bg-(--color-surface) text-(--color-text-strong) transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:bg-(--color-surface-2)', className)}>
            {children}
        </button>
    );
}

export function DangerButton({ className, disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} disabled={disabled}
            className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed bg-(--color-danger)', className)}>
            {children}
        </button>
    );
}
