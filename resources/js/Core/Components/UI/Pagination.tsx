import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface PaginationLink {
    url:    string | null;
    label:  string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
    from:  number;
    to:    number;
    total: number;
}

export default function Pagination({ links, from, to, total }: Props) {
    const { t } = useTranslation();

    if (links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-xs text-slate-400">
                {t('pagination.showing', { from, to, total })}
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, i) =>
                    !link.url ? (
                        <span
                            key={i}
                            className="px-3 py-1.5 text-xs rounded-lg opacity-40 cursor-not-allowed text-slate-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors border ${
                                link.active
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                )}
            </div>
        </div>
    );
}
