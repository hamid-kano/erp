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
                                {i > 0 && <ChevronLeft size={12} className="rtl:rotate-180" style={{ color: 'var(--color-text-muted)' }} />}
                                {isLast || !item.href ? (
                                    <span className="text-xs font-medium"
                                        style={{ color: isLast ? 'var(--color-text-strong)' : 'var(--color-text-muted)' }}>
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link href={item.href} className="text-xs transition-colors"
                                        style={{ color: 'var(--color-text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
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
                    <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-strong)' }}>{title}</h1>
                    {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
        </div>
    );
}
