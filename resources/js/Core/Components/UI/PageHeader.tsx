import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface BreadcrumbItem { label: string; href?: string; }

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    title:        string;
    subtitle?:    string;
    actions?:     ReactNode;
}

export default function PageHeader({ breadcrumbs = [], title, subtitle, actions }: Props) {
    return (
        <div className="mb-5">
            {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1.5 flex-wrap mb-3">
                    {breadcrumbs.map((item, i) => {
                        const isLast = i === breadcrumbs.length - 1;
                        return (
                            <div key={i} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronLeft size={12} className="text-slate-600 rtl:rotate-180" />}
                                {isLast || !item.href ? (
                                    <span className={`text-xs ${isLast ? 'text-white font-medium' : 'text-slate-400'}`}>
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link href={item.href} className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            )}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-white">{title}</h1>
                    {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
        </div>
    );
}
