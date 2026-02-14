import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Wayfinder is only useful during dev (generates route/action helpers).
// In production build it can fail if the php artisan command has issues,
// so we conditionally include it.
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        ...(!isProduction
            ? [wayfinder({ formVariants: true })]
            : []),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
