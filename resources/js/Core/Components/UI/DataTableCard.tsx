import { cn } from '@/Core/lib/utils';
import { ReactNode } from 'react';

interface Column<T> {
    key:     keyof T | string;
    label:   ReactNode;
    render?: (value: any, row: T) => ReactNode;
}

interface Props<T> {
    title:      ReactNode;
    subtitle?:  string;
    columns:    Column<T>[];
    data:       T[];
    footer?:    ReactNode;
    action?:    ReactNode;
    className?: string;
    emptyText?: string;
}

export default function DataTableCard<T extends Record<string, any>>({
    title, subtitle, columns, data, footer, action, className, emptyText = 'لا توجد بيانات',
}: Props<T>) {
    return (
        <div className={cn('rounded-xl border overflow-hidden', className)}
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--color-border)' }}>
                <div>
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-strong)' }}>{title}</h2>
                    {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            {columns.map((col, i) => (
                                <th key={i} className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--color-text-muted)' }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm"
                                    style={{ color: 'var(--color-text-muted)' }}>
                                    {emptyText}
                                </td>
                            </tr>
                        ) : data.map((row, i) => (
                            <tr key={i} className="transition-colors"
                                style={{ borderBottom: '1px solid var(--color-border)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                                onMouseLeave={e => (e.currentTarget.style.background = '')}>
                                {columns.map((col, j) => (
                                    <td key={j} className="px-4 py-3" style={{ color: 'var(--color-text)' }}>
                                        {col.render ? col.render(row[col.key as string], row) : (row[col.key as string] ?? '—')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {footer && (
                <div className="px-4 py-3 border-t text-xs"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                    {footer}
                </div>
            )}
        </div>
    );
}
