import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/Core/i18n';

interface UIStore {
    sidebarCollapsed:   boolean;
    sidebarMobileOpen:  boolean;
    theme:              'light' | 'dark';
    lang:               'ar' | 'en';

    toggleSidebar:       () => void;
    toggleMobileSidebar: () => void;
    closeMobileSidebar:  () => void;
    toggleTheme:         () => void;
    setLang:             (lang: 'ar' | 'en') => void;
}

const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

const applyLang = (lang: 'ar' | 'en') => {
    document.documentElement.setAttribute('dir',  lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    i18n.changeLanguage(lang);
};

const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            sidebarCollapsed:  false,
            sidebarMobileOpen: false,
            theme:             'dark',
            lang:              'ar',

            toggleSidebar: () =>
                set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

            toggleMobileSidebar: () =>
                set((s) => ({ sidebarMobileOpen: !s.sidebarMobileOpen })),

            closeMobileSidebar: () =>
                set({ sidebarMobileOpen: false }),

            toggleTheme: () =>
                set((s) => {
                    const next = s.theme === 'light' ? 'dark' : 'light';
                    applyTheme(next);
                    return { theme: next };
                }),

            setLang: (lang) => {
                applyLang(lang);
                set({ lang });
            },
        }),
        {
            name: 'erp-ui-store',
            partialize: (state) => ({
                theme: state.theme,
                lang:  state.lang,
                sidebarCollapsed: state.sidebarCollapsed,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyTheme(state.theme);
                    applyLang(state.lang);
                }
            },
        }
    )
);

export default useUIStore;
