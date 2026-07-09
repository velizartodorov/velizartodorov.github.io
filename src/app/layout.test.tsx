import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// next/font/google's Inter() is transformed at build time by Next's SWC plugin into real font
// loading; under Vitest there's no such transform, so the real import is just a factory that
// expects that transform's output and throws. Stub it with the shape layout.tsx actually uses
// (`.variable`).
vi.mock('next/font/google', () => ({
    Inter: () => ({ variable: 'font-sans-loaded' }),
}));

const { default: RootLayout } = await import('./layout');

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

afterEach(() => {
    vi.stubEnv('NODE_ENV', ORIGINAL_NODE_ENV ?? 'test');
    vi.unstubAllEnvs();
});

describe('RootLayout', () => {
    it('renders its children', () => {
        render(
            <RootLayout>
                <p>hello world</p>
            </RootLayout>,
        );

        expect(screen.getByText('hello world')).toBeInTheDocument();
    });

    it('does not load the GA scripts outside production', () => {
        vi.stubEnv('NODE_ENV', 'test');

        render(
            <RootLayout>
                <p>content</p>
            </RootLayout>,
        );

        expect(document.getElementById('ga4-init')).not.toBeInTheDocument();
    });

    it('loads the GA scripts in production', () => {
        vi.stubEnv('NODE_ENV', 'production');

        render(
            <RootLayout>
                <p>content</p>
            </RootLayout>,
        );

        expect(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')).not.toBeNull();
    });
});
