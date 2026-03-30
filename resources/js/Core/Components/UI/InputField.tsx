import { LucideIcon } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label:  string;
    icon?:  LucideIcon;
    error?: string;
    hint?:  string;
}

export default function InputField({ label, icon: Icon, error, hint, ...props }: Props) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-strong)' }}>
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon size={15} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                )}
                <input
                    {...props}
                    className="w-full py-2.5 text-sm rounded-lg border outline-none transition-all"
                    style={{
                        paddingInlineStart: Icon ? '2.25rem' : '0.75rem',
                        paddingInlineEnd:   '0.75rem',
                        background:   'var(--color-surface-2)',
                        borderColor:  error ? 'var(--color-danger)' : 'var(--color-border)',
                        color:        'var(--color-text-strong)',
                    }}
                />
            </div>
            {error && <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--color-danger)' }}>⚠ {error}</p>}
            {hint && !error && <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>}
        </div>
    );
}
