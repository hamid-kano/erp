import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface PaginationLink { url: string | null; label: string; active: boolean; }

interface Props { links: PaginationLink[]; from: number; to: number; total: number; }

export default function Pagination({ links, from, to, total }: Props) {
    const { t } = useTranslation();
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {t('pagination.showing', { from, to, total })}
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, i) =>
                    !link.url ? (
                        <span key={i} className="px-3 py-1.5 text-xs rounded-lg opacity-40 cursor-not-allowed"
                            style={{ color: 'var(--color-text-muted)' }}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <Link key={i} href={link.url} preserveScroll
                            className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
                            style={link.active
                                ? { background: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
                                : { background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }
                            }
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    )
                )}
            </div>
        </div>
    );
}
