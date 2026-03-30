import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import useUIStore from '@/Core/store/uiStore';
import {
    LayoutDashboard, Users, Package, Warehouse, ShoppingCart,
    TrendingUp, BookOpen, CreditCard, ChevronDown, ChevronRight,
    LogOut, ChevronsLeft,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/Core/lib/utils';

interface NavChild { label: string; i18nKey: string; href: string; }
interface NavGroup {
    groupKey: string;
    items: { label: string; i18nKey: string; href?: string; icon: React.ReactNode; children?: NavChild[] }[];
}

const NAV_GROUPS: NavGroup[] = [
    {
        groupKey: 'nav.dashboard',
        items: [
            { label: 'لوحة القيادة', i18nKey: 'nav.dashboard', href: '/', icon: <LayoutDashboard size={17} /> },
        ],
    },
    {
        groupKey: 'nav.crm',
        items: [
            {
                label: 'CRM', i18nKey: 'nav.crm', icon: <Users size={17} />,
                children: [
                    { label: 'العملاء',  i18nKey: 'nav.customers', href: '/customers' },
                    { label: 'الموردين', i18nKey: 'nav.suppliers', href: '/suppliers' },
                ],
            },
        ],
    },
    {
        groupKey: 'nav.inventory',
        items: [
            {
                label: 'المخزون', i18nKey: 'nav.inventory', icon: <Package size={17} />,
                children: [
                    { label: 'الأصناف',         i18nKey: 'nav.items',       href: '/items' },
                    { label: 'مستويات المخزون', i18nKey: 'nav.stockLevels', href: '/stock/levels' },
                ],
            },
            {
                label: 'المستودعات', i18nKey: 'nav.warehouses', icon: <Warehouse size={17} />,
                children: [
                    { label: 'المستودعات', i18nKey: 'nav.warehouses', href: '/warehouses' },
                ],
            },
        ],
    },
    {
        groupKey: 'nav.purchasing',
        items: [
            {
                label: 'المشتريات', i18nKey: 'nav.purchasing', icon: <ShoppingCart size={17} />,
                children: [
                    { label: 'أوامر الشراء',  i18nKey: 'nav.purchaseOrders',   href: '/purchase-orders' },
                    { label: 'فواتير الشراء', i18nKey: 'nav.purchaseInvoices', href: '/purchase-invoices' },
                ],
            },
            {
                label: 'المبيعات', i18nKey: 'nav.sales', icon: <TrendingUp size={17} />,
                children: [
                    { label: 'أوامر البيع',     i18nKey: 'nav.salesOrders',   href: '/sales-orders' },
                    { label: 'فواتير المبيعات', i18nKey: 'nav.salesInvoices', href: '/sales-invoices' },
                ],
            },
        ],
    },
    {
        groupKey: 'nav.accounting',
        items: [
            {
                label: 'المحاسبة', i18nKey: 'nav.accounting', icon: <BookOpen size={17} />,
                children: [
                    { label: 'القيود',         i18nKey: 'nav.journalEntries', href: '/journal-entries' },
                    { label: 'الحسابات',       i18nKey: 'nav.accounts',       href: '/accounts' },
                    { label: 'ميزان المراجعة', i18nKey: 'nav.trialBalance',   href: '/reports/trial-balance' },
                ],
            },
            {
                label: 'المدفوعات', i18nKey: 'nav.payments', icon: <CreditCard size={17} />,
                children: [
                    { label: 'المدفوعات', i18nKey: 'nav.payments', href: '/payments' },
                ],
            },
        ],
    },
];

function NavItem({ item, collapsed }: { item: NavGroup['items'][0]; collapsed: boolean }) {
    const [open, setOpen] = useState(false);
    const { url } = usePage();
    const { t } = useTranslation();
    const label = t(item.i18nKey);

    if (item.href) {
        const isActive = url === item.href;
        return (
            <Link href={item.href}
                className={cn('flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors whitespace-nowrap',
                    isActive ? 'text-(--color-sidebar-active) bg-(--color-primary)/10' : 'text-(--color-sidebar-text) hover:bg-(--color-primary)/10 hover:text-white'
                )}>
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span>{label}</span>}
            </Link>
        );
    }

    return (
        <div>
            <button onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors text-(--color-sidebar-text) hover:bg-(--color-primary)/10 hover:text-white whitespace-nowrap">
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                    <>
                        <span className="flex-1 text-start">{label}</span>
                        <ChevronDown size={13} className={cn('transition-transform shrink-0', open && 'rotate-180')} />
                    </>
                )}
            </button>
            {open && !collapsed && (
                <div className="ms-4 mt-0.5 border-s border-white/10 ps-3 space-y-0.5">
                    {item.children?.map(child => {
                        const isActive = url.startsWith(child.href);
                        return (
                            <Link key={child.href} href={child.href}
                                className={cn('flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-colors',
                                    isActive ? 'text-(--color-sidebar-active) font-semibold' : 'text-(--color-sidebar-text) hover:text-white'
                                )}>
                                <ChevronRight size={11} className="shrink-0" />
                                {t(child.i18nKey)}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function Sidebar() {
    const { t } = useTranslation();
    const { sidebarCollapsed, sidebarMobileOpen, lang, toggleSidebar, closeMobileSidebar } = useUIStore();
    const isRTL = lang === 'ar';

    const mobileTranslate = sidebarMobileOpen
        ? 'translate-x-0'
        : isRTL ? 'max-md:translate-x-full' : 'max-md:-translate-x-full';

    const collapseRotate = isRTL
        ? (sidebarCollapsed ? '' : 'rotate-180')
        : (sidebarCollapsed ? 'rotate-180' : '');

    return (
        <>
            {sidebarMobileOpen && (
                <div className="fixed inset-0 z-[199] bg-black/50 backdrop-blur-sm md:hidden" onClick={closeMobileSidebar} />
            )}

            <aside className={cn(
                'fixed top-0 h-screen z-[200] flex flex-col overflow-hidden',
                'transition-all duration-200 ease-in-out',
                isRTL ? 'right-0' : 'left-0',
                sidebarCollapsed ? 'w-[68px]' : 'w-[260px]',
                mobileTranslate,
            )} style={{ background: 'var(--color-sidebar-bg)' }}>

                {/* Logo */}
                <div className="flex items-center gap-3 px-[18px] min-h-16 border-b border-white/[0.06]">
                    <div className="w-9 h-9 rounded-[10px] grid place-items-center text-lg shrink-0 text-white font-bold"
                        style={{ background: 'var(--color-primary)' }}>
                        ✦
                    </div>
                    <span className={cn('text-base font-bold text-white whitespace-nowrap transition-opacity duration-200',
                        sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
                        ERP System
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2.5 py-3 overflow-y-auto overflow-x-hidden space-y-0.5">
                    {NAV_GROUPS.map(group => (
                        <div key={group.groupKey}>
                            <div className={cn('text-[10px] font-semibold tracking-widest uppercase px-2.5 pt-4 pb-1.5 whitespace-nowrap transition-opacity duration-200',
                                sidebarCollapsed ? 'opacity-0' : 'opacity-100')}
                                style={{ color: 'var(--color-sidebar-text)' }}>
                                {t(group.groupKey)}
                            </div>
                            {group.items.map(item => (
                                <NavItem key={item.i18nKey} item={item} collapsed={sidebarCollapsed} />
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-2.5 py-3 border-t border-white/[0.06] space-y-0.5">
                    <button onClick={() => router.post('/logout')}
                        className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full transition-colors text-(--color-sidebar-text) hover:bg-(--color-primary)/10 hover:text-white">
                        <LogOut size={17} className="shrink-0" />
                        <span className={cn('text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-200',
                            sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
                            {t('nav.logout')}
                        </span>
                    </button>
                    <button onClick={toggleSidebar}
                        className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg w-full transition-colors text-(--color-sidebar-text) hover:bg-(--color-primary)/10 hover:text-white">
                        <ChevronsLeft size={17} className={cn('shrink-0 transition-transform duration-200', collapseRotate)} />
                        <span className={cn('text-[13.5px] font-medium whitespace-nowrap transition-opacity duration-200',
                            sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
                            {t('nav.collapse')}
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}
