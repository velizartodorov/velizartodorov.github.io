import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const commitSha = process.env.VITE_COMMIT_SHA ?? (() => {
  try { return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(); }
  catch { return undefined; }
})();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Using relative path for GitHub Pages compatibility
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
    outDir: 'docs',
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
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
  define: {
    'import.meta.env.VITE_COMMIT_SHA': JSON.stringify(commitSha),
  },
  publicDir: resolve(__dirname, 'public'),
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});