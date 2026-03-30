import { InputHTMLAttributes, LabelHTMLAttributes, HTMLAttributes, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { cn } from '@/Core/lib/utils';

// ── Checkbox ──────────────────────────────────────────
export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input type="checkbox" {...props}
            className={cn('w-4 h-4 rounded border transition-colors cursor-pointer', className)}
            style={{ accentColor: 'var(--color-primary)', borderColor: 'var(--color-border)' }}
        />
    );
}

// ── InputLabel ────────────────────────────────────────
export function InputLabel({ value, className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label {...props} className={cn('block text-sm font-medium mb-1.5', className)}
            style={{ color: 'var(--color-text-strong)' }}>
            {value ?? children}
        </label>
    );
}

// ── InputError ────────────────────────────────────────
export function InputError({ message, className, ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    if (!message) return null;
    return (
        <p {...props} className={cn('mt-1 text-xs flex items-center gap-1', className)}
            style={{ color: 'var(--color-danger)' }}>
            ⚠ {message}
        </p>
    );
}

// ── TextInput ─────────────────────────────────────────
export const TextInput = forwardRef<
    { focus: () => void },
    InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean; error?: boolean }
>(function TextInput({ type = 'text', className, isFocused = false, error, ...props }, ref) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({ focus: () => localRef.current?.focus() }));
    useEffect(() => { if (isFocused) localRef.current?.focus(); }, [isFocused]);

    return (
        <input {...props} type={type} ref={localRef}
            className={cn('w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all', className)}
            style={{
                background:   'var(--color-surface-2)',
                borderColor:  error ? 'var(--color-danger)' : 'var(--color-border)',
                color:        'var(--color-text-strong)',
            }}
        />
    );
});
