import '../css/app.css';
import '@/Core/i18n';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const modulePages = import.meta.glob('./Modules/**/*.tsx', { eager: false });
const authPages   = import.meta.glob('./Pages/**/*.tsx',   { eager: false });

createInertiaApp({
    title: (title) => `${title} - ERP`,
    resolve: async (name) => {
        // Auth/Login → Pages/Auth/Login.tsx
        const authKey = `./Pages/${name}.tsx`;
        if (authPages[authKey]) {
            return (await authPages[authKey]() as any).default;
        }
        // Analytics/Dashboard/Index → Modules/Analytics/Dashboard/Index.tsx
        const moduleKey = `./Modules/${name}.tsx`;
        if (modulePages[moduleKey]) {
            return (await modulePages[moduleKey]() as any).default;
        }
        throw new Error(`Page not found: ${name}`);
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#3b82f6' },
});
