import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    title: (title) => `${title} - ERP`,
    resolve: (name) =>
        resolvePageComponent(
            `./Modules/${name}.tsx`,
            import.meta.glob('./Modules/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#3b82f6' },
});
