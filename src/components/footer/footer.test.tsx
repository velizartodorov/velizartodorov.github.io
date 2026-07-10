import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));
vi.mock('./utils', () => ({ useCurrentYear: vi.fn() }));
vi.mock('../common/profile.init', () => ({ useProfile: vi.fn() }));

afterEach(() => {
    vi.unstubAllEnvs();
});

// COMMIT_SHA is read from process.env at module load time, so a fresh module instance (via
// resetModules) is required for each value to actually take effect.
async function renderFooter(commitSha: string) {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_COMMIT_SHA', commitSha);

    const { useTranslation } = await import('react-i18next');
    vi.mocked(useTranslation).mockReturnValue({ t: () => 'Powered by' } as unknown as ReturnType<
        typeof useTranslation
    >);
    const { useCurrentYear } = await import('./utils');
    vi.mocked(useCurrentYear).mockReturnValue({ year: 2026, timeZone: 'UTC' });
    const { useProfile } = await import('../common/profile.init');
    vi.mocked(useProfile).mockReturnValue({ name: 'Test User' } as unknown as ReturnType<typeof useProfile>);

    const { default: Footer } = await import('./footer');
    return render(<Footer />);
}

describe('Footer', () => {
    it('does not render a commit link when NEXT_PUBLIC_COMMIT_SHA is unset', async () => {
        await renderFooter('');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders a shortened commit link when NEXT_PUBLIC_COMMIT_SHA is set', async () => {
        await renderFooter('abcdef1234567890');

        const link = screen.getByRole('link', { name: 'abcdef1' });
        expect(link).toHaveAttribute(
            'href',
            'https://github.com/velizartodorov/velizartodorov.github.io/commit/abcdef1234567890',
        );
    });
});
