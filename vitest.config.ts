import { defineConfig } from 'vitest/config';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
    // Translation data lives in src/translations/**/*.yml (see src/i18n.ts); this plugin lets
    // Vite/Vitest import those the same way Next's bundlers do.
    plugins: [yaml()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
        maxConcurrency: 20, // let src/links.test.ts fire all its concurrent checks in one batch
    },
});
