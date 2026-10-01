import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';

export default tseslint.config(
    { ignores: ['.next/**', 'out/**', 'build/**', 'dist/**', 'node_modules_old/**'] },
    {
        files: ['src/**/*.{ts,tsx}'],
        extends: [tailwind.configs.recommended],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        settings: {
            tailwindcss: {
                cssConfigPath: './src/index.css',
            },
        },
        rules: {
            // prettier-plugin-tailwindcss already sorts classnames on save/commit and
            // disagrees with this rule's ordering on arbitrary values, so it would just
            // fight the formatter.
            'tailwindcss/classnames-order': 'off',
            // `fade-in-text` is a plain custom CSS class (defined in the inline <style> in
            // layout.tsx), not a Tailwind utility.
            'tailwindcss/no-custom-classname': ['warn', { whitelist: ['fade-in-text'] }],
            // This plugin doesn't fully understand Tailwind v4's arbitrary-value syntax for
            // decimal scale steps: it flags `scale-[1.01]` as unnecessary and offers to
            // "fix" it to `scale-1.01`, but that bare form compiles to no CSS rule at all
            // (verified against the built output) - it's a false positive, not a real
            // simplification.
            'tailwindcss/no-unnecessary-arbitrary-value': 'off',
        },
    },
);
