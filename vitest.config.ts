import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
        maxConcurrency: 20, // let src/links.test.ts fire all its concurrent checks in one batch
    },
});
