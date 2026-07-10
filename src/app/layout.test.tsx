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

    it.each([
        { name: 'does not load the GA scripts outside production', env: 'test', rendered: false },
        { name: 'loads the GA scripts in production', env: 'production', rendered: true },
    ])('$name', ({ env, rendered }) => {
        vi.stubEnv('NODE_ENV', env);

        render(
            <RootLayout>
                <p>content</p>
            </RootLayout>,
        );

        if (rendered) {
            expect(document.getElementById('ga4-init')).toBeInTheDocument();
        } else {
            expect(document.getElementById('ga4-init')).not.toBeInTheDocument();
        }
    });
});
