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
        },
    },
);
