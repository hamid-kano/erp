import { usePage } from '@inertiajs/react';
import { PageProps } from '@/Core/types';
import useUIStore from '@/Core/store/uiStore';
import { useApplySettings } from '@/Core/hooks/useApplySettings';
import Sidebar from '@/Core/Components/Sidebar';
import Navbar from '@/Core/Components/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    if (!auth?.user) return null;

    const { sidebarCollapsed, lang } = useUIStore();
    useApplySettings();

    const isRTL = lang === 'ar';
    const offset = sidebarCollapsed
        ? (isRTL ? 'md:mr-[68px]'  : 'md:ml-[68px]')
        : (isRTL ? 'md:mr-[260px]' : 'md:ml-[260px]');

    return (
        <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
            <Sidebar />
            <div className={`flex flex-col min-h-screen transition-all duration-200 ${offset}`}>
                <Navbar />
                <main className="flex-1 p-4 md:p-7">
                    {children}
                </main>
            </div>
        </div>
    );
}
