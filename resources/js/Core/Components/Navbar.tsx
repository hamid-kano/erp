import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Sun, Bell, User, Settings, LogOut, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/Core/lib/utils';
import useUIStore from '@/Core/store/uiStore';
import { PageProps } from '@/Core/types';

export default function Navbar() {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const { lang, theme, toggleMobileSidebar, toggleTheme, setLang } = useUIStore();
    const isRTL = lang === 'ar';

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const initials = auth?.user?.name
        ? auth.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    const menuItems = [
        { type: 'label', label: auth?.user?.email ?? '' },
        { type: 'divider' },
        { label: t('nav.profile'),  icon: User,    onClick: () => router.visit('/profile') },
        { label: t('nav.settings'), icon: Settings, onClick: () => router.visit('/profile') },
        { type: 'divider' },
        { label: t('nav.logout'),   icon: LogOut,  onClick: () => router.post('/logout'), danger: true },
    ];

    return (
        <header className="sticky top-0 z-[100] h-16 flex items-center px-4 gap-2 w-full border-b shadow-sm"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>

            {/* Mobile toggle */}
            <button onClick={toggleMobileSidebar}
                className="md:hidden grid place-items-center w-9 h-9 rounded-lg transition-colors hover:bg-(--color-surface-2)"
                style={{ color: 'var(--color-text)' }}>
                <Menu size={18} />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-[360px] hidden md:block">
                <Search size={14} className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ insetInlineStart: '12px', color: 'var(--color-text-muted)' }} />
                <input type="search" placeholder={t('common.search') + '...'}
                    className="w-full py-2 text-[13px] rounded-lg border outline-none transition-all"
                    style={{
                        paddingInlineStart: '2rem', paddingInlineEnd: '0.75rem',
                        background: 'var(--color-surface-2)', borderColor: 'var(--color-border)',
                        color: 'var(--color-text-strong)',
                    }} />
            </div>

            <div className="flex items-center gap-1.5 ms-auto">
                {/* Lang */}
                <button onClick={() => setLang(isRTL ? 'en' : 'ar')}
                    className="h-8 px-2.5 rounded-lg border text-[11px] font-bold transition-colors hover:bg-(--color-surface-2)"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    {isRTL ? 'EN' : 'ع'}
                </button>

                {/* Theme */}
                <button onClick={toggleTheme}
                    className="w-8 h-8 rounded-lg border grid place-items-center transition-colors hover:bg-(--color-surface-2)"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                </button>

                {/* Notifications */}
                <button className="relative w-8 h-8 rounded-lg border grid place-items-center transition-colors hover:bg-(--color-surface-2)"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    <Bell size={15} />
                    <span className="absolute top-1 end-1 w-2 h-2 rounded-full border-2"
                        style={{ background: 'var(--color-danger)', borderColor: 'var(--color-surface)' }} />
                </button>

                <div className="w-px h-6 mx-0.5" style={{ background: 'var(--color-border)' }} />

                {/* User Dropdown */}
                <div ref={menuRef} className="relative">
                    <button onClick={() => setMenuOpen(o => !o)}
                        className="flex items-center gap-2 ps-1 pe-2 py-1 rounded-xl border transition-colors hover:bg-(--color-surface-2)"
                        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                        <div className="w-7 h-7 rounded-lg grid place-items-center text-white text-[11px] font-bold shrink-0"
                            style={{ background: 'var(--color-primary)' }}>
                            {initials}
                        </div>
                        <div className="leading-tight hidden md:block text-start">
                            <div className="text-[13px] font-semibold" style={{ color: 'var(--color-text-strong)' }}>
                                {auth?.user?.name}
                            </div>
                            <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                ERP
                            </div>
                        </div>
                    </button>

                    {menuOpen && (
                        <div className={cn(
                            'absolute top-full mt-1.5 z-[300] min-w-[180px] rounded-xl shadow-lg py-1.5',
                            'animate-[modalIn_0.15s_ease] end-0',
                        )} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            {menuItems.map((item, i) => {
                                if (item.type === 'divider') return (
                                    <div key={i} className="my-1 border-t" style={{ borderColor: 'var(--color-border)' }} />
                                );
                                if (item.type === 'label') return (
                                    <p key={i} className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider truncate"
                                        style={{ color: 'var(--color-text-muted)' }}>
                                        {item.label}
                                    </p>
                                );
                                const Icon = item.icon!;
                                return (
                                    <button key={i} onClick={() => { item.onClick?.(); setMenuOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-start transition-colors hover:bg-(--color-surface-2)"
                                        style={{ color: item.danger ? 'var(--color-danger)' : 'var(--color-text-strong)' }}>
                                        <Icon size={14} className="shrink-0" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
