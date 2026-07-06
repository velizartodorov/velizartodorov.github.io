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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <body
                className="text-app-text bg-app-bg font-sans [font-feature-settings:'cv11','ss01'] tracking-[-0.01em] antialiased transition-colors duration-200 ease-in-out"
                suppressHydrationWarning
            >
                <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
                {children}
            </body>
        </html>
    );
}
