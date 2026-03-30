import '../css/app.css';
import '@/Core/i18n';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from '@/Core/Components/ErrorBoundary';

const modulePages = import.meta.glob('./Modules/**/*.tsx', { eager: false });
const authPages   = import.meta.glob('./Pages/**/*.tsx',   { eager: false });

createInertiaApp({
    title: (title) => `${title} - ERP`,
    resolve: async (name) => {
        const authKey   = `./Pages/${name}.tsx`;
        const moduleKey = `./Modules/${name}.tsx`;

        if (authPages[authKey])     return (await authPages[authKey]()   as any).default;
        if (modulePages[moduleKey]) return (await modulePages[moduleKey]() as any).default;

        throw new Error(`Page not found: ${name}`);
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: { color: 'var(--color-primary)' },
});
