import { useEffect } from 'react';
import useUIStore from '@/Core/store/uiStore';

export function useApplySettings() {
    const { lang, theme } = useUIStore();

    useEffect(() => {
        document.documentElement.setAttribute('dir',  lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);
    }, [lang]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
}
