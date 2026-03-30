import { cn } from '@/Core/lib/utils';
import { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

export default function Select({ className, error, children, ...props }: Props) {
    return (
        <select
            {...props}
            className={cn(
                'w-full py-2.5 text-[13px] rounded-lg outline-none transition-all appearance-none cursor-pointer',
                'bg-(--color-surface-2) text-(--color-text-strong)',
                error
                    ? 'border border-(--color-danger)'
                    : 'border border-(--color-border) focus:border-(--color-primary)',
                className,
            )}
            style={{
                paddingInlineStart:  '0.75rem',
                paddingInlineEnd:    '2rem',
                backgroundImage:     `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat:    'no-repeat',
                backgroundPosition:  'left 10px center',
            }}
        >
            {children}
        </select>
    );
}
