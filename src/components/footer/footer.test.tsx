import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { loadAllStrings } from '../../app/translations/resources';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

const strings = await loadAllStrings();
vi.mock('./utils', () => ({ useCurrentYear: vi.fn() }));
vi.mock('../profile/profile.init', () => ({ useProfile: vi.fn() }));

afterEach(() => {
    vi.unstubAllEnvs();
});

// COMMIT_SHA is read from process.env at module load time, so a fresh module instance (via
// resetModules) is required for each value to actually take effect.
async function renderFooter(commitSha: string) {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_COMMIT_SHA', commitSha);

    const { useTranslation } = await import('react-i18next');
    vi.mocked(useTranslation).mockReturnValue({ t: (key: string) => strings('en', key) } as unknown as ReturnType<
        typeof useTranslation
    >);
    const { useCurrentYear } = await import('./utils');
    vi.mocked(useCurrentYear).mockReturnValue({ year: 2026, timeZone: 'UTC' });
    const { useProfile } = await import('../profile/profile.init');
    vi.mocked(useProfile).mockReturnValue({ name: 'Test User' } as unknown as ReturnType<typeof useProfile>);

    const { default: Footer, REPO_URL } = await import('./footer');
    return { ...render(<Footer />), REPO_URL };
}

describe('Footer', () => {
    it('does not render a commit link when NEXT_PUBLIC_COMMIT_SHA is unset', async () => {
        await renderFooter('');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders a shortened commit link when NEXT_PUBLIC_COMMIT_SHA is set', async () => {
        const sha = 'abcdef1234567890';
        const { REPO_URL } = await renderFooter(sha);

        const link = screen.getByRole('link', { name: sha.slice(0, 7) });
        expect(link).toHaveAttribute('href', `${REPO_URL}/commit/${sha}`);
    });
});
