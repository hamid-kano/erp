import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/Core/lib/utils';

interface PaginationLink { url: string | null; label: string; active: boolean; }
interface Props { links: PaginationLink[]; from: number; to: number; total: number; }

export default function Pagination({ links, from, to, total }: Props) {
    const { t } = useTranslation();
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-[12px] text-(--color-text-muted)">
                {t('pagination.showing', { from, to, total })}
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, i) =>
                    !link.url ? (
                        <span key={i}
                            className="px-3 py-1.5 text-[12px] rounded-lg opacity-40 cursor-not-allowed text-(--color-text-muted)"
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <Link key={i} href={link.url} preserveScroll
                            className={cn(
                                'px-3 py-1.5 text-[12px] rounded-lg border transition-colors',
                                link.active
                                    ? 'bg-(--color-primary) text-white border-(--color-primary)'
                                    : 'bg-(--color-surface) text-(--color-text) border-(--color-border) hover:bg-(--color-surface-2)'
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    )
                )}
            </div>
        </div>
    );
}
