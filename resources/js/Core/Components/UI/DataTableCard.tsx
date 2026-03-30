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
        <div className={cn('bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden', className)}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
                <div>
                    <h2 className="text-[14px] font-semibold text-(--color-text-strong)">{title}</h2>
                    {subtitle && <p className="text-[12px] text-(--color-text-muted) mt-0.5">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-(--color-border)">
                            {columns.map((col, i) => (
                                <th key={i} className="text-right px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-(--color-text-muted)">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-[13px] text-(--color-text-muted)">
                                    {emptyText}
                                </td>
                            </tr>
                        ) : data.map((row, i) => (
                            <tr key={i} className="border-b border-(--color-border) hover:bg-(--color-surface-2) transition-colors">
                                {columns.map((col, j) => (
                                    <td key={j} className="px-4 py-3 text-[13px] text-(--color-text)">
                                        {col.render ? col.render(row[col.key as string], row) : (row[col.key as string] ?? '—')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {footer && (
                <div className="px-4 py-3 border-t border-(--color-border) bg-(--color-surface-2) text-[12px] text-(--color-text-muted)">
                    {footer}
                </div>
            )}
        </div>
    );
}
