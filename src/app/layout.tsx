import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-sans-loaded',
    display: 'swap',
});

const SITE_URL = 'https://velizartodorov.github.io';

export const metadata: Metadata = {
    title: 'Velizar Todorov',
    metadataBase: new URL(SITE_URL),
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
};

// Sets data-bs-theme before hydration/paint to avoid a flash of the wrong theme.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-bs-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
})();
`;

// Doesn't need Tailwind's build-time processing (plain custom properties and keyframes),
// so it lives here instead of in index.css: the light/dark palette, the theme-switch
// transition (fades backgrounds/borders uniformly; text color snaps instantly to avoid the
// low-contrast midtone "blink"), and the language-switch fade-in (scoped to text-bearing
// tags rather than every descendant, so only the translated content itself dissolves).
const GLOBAL_STYLES = `
:root {
  /* GitHub Primer light palette */
  --app-bg: #ffffff;
  --app-surface: #ffffff;
  --app-surface-alt: #f6f8fa;
  --app-border: #d0d7de;
  --app-text: #1f2328;
  --app-text-muted: #656d76;
  --app-accent: #0969da;
  --app-accent-subtle: rgba(9, 105, 218, 0.1);
  --app-shadow: rgba(31, 35, 40, 0.04);
  --app-icon-bg: #ffffff;
  --app-dot-ring: #ffffff;
  --app-link: #0969da;
  --app-link-hover: #0860c4;
}

[data-bs-theme='dark'] {
  /* GitHub Primer dark palette */
  --app-bg: #0d1117;
  --app-surface: #161b22;
  --app-surface-alt: #21262d;
  --app-border: #30363d;
  --app-text: #e6edf3;
  --app-text-muted: #7d8590;
  --app-accent: #2f81f7;
  --app-accent-subtle: rgba(56, 139, 253, 0.15);
  --app-shadow: rgba(0, 0, 0, 0.3);
  --app-icon-bg: #21262d;
  --app-dot-ring: #161b22;
  --app-link: #2f81f7;
  --app-link-hover: #58a6ff;
}

.theme-switching,
.theme-switching *,
.theme-switching *::before,
.theme-switching *::after {
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    fill 0.25s ease,
    stroke 0.25s ease,
    box-shadow 0.25s ease !important;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in-text :is(h1, h2, h3, h4, h5, h6, p, span, a, li) {
  animation: fade-in 0.1s ease-in-out;
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body
                className="text-app-text bg-app-bg font-sans [font-feature-settings:'cv11','ss01'] tracking-[-0.01em] antialiased transition-colors duration-200 ease-in-out"
                suppressHydrationWarning
            >
                <style>{GLOBAL_STYLES}</style>
                <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
                {children}
            </body>
        </html>
    );
}
