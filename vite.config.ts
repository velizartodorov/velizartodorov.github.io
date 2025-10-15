import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Change this to your repo name if deploying to GitHub Pages
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  },
  optimizeDeps: {
    include: ['i18next', 'react-i18next']
  },
  // Configure proper handling of JSON files
  json: {
    stringify: false
  },
  publicDir: resolve(__dirname, 'public')
});