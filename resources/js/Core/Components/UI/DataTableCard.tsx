import { cn } from '@/Core/lib/utils';
import { ReactNode } from 'react';

interface Column<T> {
    key:     keyof T | string;
    label:   string;
    render?: (value: any, row: T) => ReactNode;
}

interface Props<T> {
    title:      string;
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
        <div className={cn('bg-slate-900 border border-slate-800 rounded-xl overflow-hidden', className)}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <div>
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-800">
                        <tr>
                            {columns.map((col) => (
                                <th key={String(col.key)} className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 text-sm">
                                    {emptyText}
                                </td>
                            </tr>
                        ) : data.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="px-4 py-3 text-slate-300">
                                        {col.render
                                            ? col.render(row[col.key as string], row)
                                            : (row[col.key as string] ?? '—')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {footer && (
                <div className="px-4 py-3 border-t border-slate-800 bg-slate-800/50 text-xs text-slate-400">
                    {footer}
                </div>
            )}
        </div>
    );
}
