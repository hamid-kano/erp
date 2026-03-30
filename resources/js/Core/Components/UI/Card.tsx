import { cn } from '@/Core/lib/utils';
import { ReactNode } from 'react';

interface Props {
    title?:        ReactNode;
    subtitle?:     string;
    action?:       ReactNode;
    footer?:       ReactNode;
    children:      ReactNode;
    className?:    string;
    bodyClassName?: string;
}

export default function Card({ title, subtitle, action, footer, children, className, bodyClassName }: Props) {
    return (
        <div className={cn('bg-slate-900 border border-slate-800 rounded-xl shadow-sm', className)}>
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                    <div>
                        {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
                        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            <div className={cn('p-5', bodyClassName)}>{children}</div>
            {footer && (
                <div className="px-5 py-3 border-t border-slate-800 bg-slate-800/50 rounded-b-xl text-xs text-slate-400">
                    {footer}
                </div>
            )}
        </div>
    );
}
