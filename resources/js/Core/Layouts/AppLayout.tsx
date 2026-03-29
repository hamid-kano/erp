import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { PageProps } from '@/Core/types';
import {
    LayoutDashboard, Users, Package, Warehouse, ShoppingCart,
    TrendingUp, BookOpen, CreditCard, ChevronDown, Menu, X,
    LogOut, User, ChevronRight,
} from 'lucide-react';
import { cn } from '@/Core/lib/utils';

interface NavItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
    {
        label: 'لوحة القيادة',
        href: '/',
        icon: <LayoutDashboard size={18} />,
    },
    {
        label: 'CRM',
        icon: <Users size={18} />,
        children: [
            { label: 'العملاء', href: '/customers' },
            { label: 'الموردين', href: '/suppliers' },
        ],
    },
    {
        label: 'المخزون',
        icon: <Package size={18} />,
        children: [
            { label: 'المنتجات', href: '/products' },
            { label: 'مستويات المخزون', href: '/stock/levels' },
        ],
    },
    {
        label: 'المستودعات',
        icon: <Warehouse size={18} />,
        children: [
            { label: 'المستودعات', href: '/warehouses' },
            { label: 'المواقع', href: '/locations' },
        ],
    },
    {
        label: 'المشتريات',
        icon: <ShoppingCart size={18} />,
        children: [
            { label: 'أوامر الشراء', href: '/purchase-orders' },
            { label: 'فواتير الشراء', href: '/purchase-invoices' },
        ],
    },
    {
        label: 'المبيعات',
        icon: <TrendingUp size={18} />,
        children: [
            { label: 'أوامر البيع', href: '/sales-orders' },
            { label: 'الفواتير', href: '/sales-invoices' },
        ],
    },
    {
        label: 'المحاسبة',
        icon: <BookOpen size={18} />,
        children: [
            { label: 'القيود', href: '/journal-entries' },
            { label: 'الحسابات', href: '/accounts' },
            { label: 'ميزان المراجعة', href: '/reports/trial-balance' },
        ],
    },
    {
        label: 'المدفوعات',
        icon: <CreditCard size={18} />,
        children: [
            { label: 'المدفوعات', href: '/payments' },
        ],
    },
];

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
    const [open, setOpen] = useState(false);
    const { url } = usePage();

    if (item.href) {
        return (
            <Link
                href={item.href}
                className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    url === item.href
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
            >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    'text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
            >
                {item.icon}
                {!collapsed && (
                    <>
                        <span className="flex-1 text-right">{item.label}</span>
                        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
                    </>
                )}
            </button>
            {open && !collapsed && (
                <div className="mr-6 mt-1 space-y-1 border-r border-slate-700 pr-3">
                    {item.children?.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                                url.startsWith(child.href)
                                    ? 'text-blue-400 font-medium'
                                    : 'text-slate-400 hover:text-white'
                            )}
                        >
                            <ChevronRight size={12} />
                            {child.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    if (!auth?.user) return null;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden" dir="rtl">
            {/* Sidebar */}
            <aside
                className={cn(
                    'flex flex-col bg-slate-900 border-l border-slate-800 transition-all duration-300 shrink-0',
                    sidebarCollapsed ? 'w-16' : 'w-64',
                    'hidden md:flex'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    {!sidebarCollapsed && (
                        <span className="text-white font-bold text-lg">ERP System</span>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-slate-400 hover:text-white p-1 rounded"
                    >
                        <Menu size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {navItems.map((item) => (
                        <NavItemComponent key={item.label} item={item} collapsed={sidebarCollapsed} />
                    ))}
                </nav>

                {/* User */}
                <div className="p-3 border-t border-slate-800">
                    <div className={cn('flex items-center gap-3', sidebarCollapsed && 'justify-center')}>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <User size={14} className="text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{auth.user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{auth.user.email}</p>
                            </div>
                        )}
                        {!sidebarCollapsed && (
                            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-1">
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute right-0 top-0 h-full w-64 bg-slate-900 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-slate-800">
                            <span className="text-white font-bold text-lg">ERP System</span>
                            <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                                <X size={18} />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                            {navItems.map((item) => (
                                <NavItemComponent key={item.label} item={item} collapsed={false} />
                            ))}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="md:hidden text-slate-400 hover:text-white"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-3 mr-auto">
                        <span className="text-slate-400 text-sm">{auth.user.name}</span>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-400">
                            <LogOut size={16} />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
