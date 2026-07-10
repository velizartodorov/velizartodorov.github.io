import { createRequire } from 'node:module';
import { defineConfig, type Plugin } from 'vitest/config';
import yaml from '@rollup/plugin-yaml';

const require = createRequire(import.meta.url);
const { parseFrontmatter, stripStructuralNewlines } = require('./loaders/markdown-frontmatter-loader.cjs');

// Mirrors loaders/markdown-frontmatter-loader.cjs (the webpack/Turbopack loader Next uses) so
// Vitest resolves the same *.md translation modules the same way the app build does.
function markdownFrontmatter(): Plugin {
    return {
        name: 'markdown-frontmatter',
        transform(source, id) {
            if (!id.endsWith('.md')) return;
            const { data, content } = parseFrontmatter(source);
            return `export default ${JSON.stringify({ ...data, body: stripStructuralNewlines(content) })};`;
        },
    };
}

export default defineConfig({
    // Translation data lives in src/translations/**/*.{yml,md} (see src/translations/i18n.ts); these plugins
    // let Vite/Vitest import those the same way Next's bundlers do.
    plugins: [yaml(), markdownFrontmatter()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.ts'],
        maxConcurrency: 20, // let src/links.test.ts fire all its concurrent checks in one batch
        coverage: {
            provider: 'v8',
            // lcov is what SonarCloud's sonar.javascript.lcov.reportPaths expects; json-summary
            // and json are what davelosert/vitest-coverage-report-action reads to post the
            // overall-coverage PR comment.
            reporter: ['text', 'lcov', 'json-summary', 'json'],
        },
    },
});
