import { SelectHTMLAttributes } from 'react';
import { cn } from '@/Core/lib/utils';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

export default function Select({ className, error, children, ...props }: Props) {
    return (
        <select
            {...props}
            className={cn('w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all appearance-none cursor-pointer', className)}
            style={{
                background:   'var(--color-surface-2)',
                borderColor:  error ? 'var(--color-danger)' : 'var(--color-border)',
                color:        'var(--color-text-strong)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat:   'no-repeat',
                backgroundPosition: 'left 12px center',
            }}
        >
            {children}
        </select>
    );
}
