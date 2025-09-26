import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/App.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],  
    build: {
        manifest: 'manifest.json',
        emptyOutDir: true,
        outDir: 'public/build',
        rollupOptions: {
            input: 'resources/js/main.jsx',
            output: {
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
    }

    
});
