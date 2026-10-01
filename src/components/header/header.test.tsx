import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './header';
import type { Profile } from '../profile/profile';

vi.mock('./theme_toggle', () => ({ default: () => <div data-testid="theme-toggle" /> }));
vi.mock('../../app/translations/language_selector', () => ({
    LanguageSelector: () => <div data-testid="language-selector" />,
}));
vi.mock('../profile/profile.init', () => ({ useProfile: vi.fn() }));

const PROFILE: Profile = {
    name: 'Test User',
    imageUrl: '/test.png',
    email: { label: 'Email Label', icon: '/email.svg', width: 20, url: 'mailto:test@example.com' },
    address: { label: 'Gent', icon: '/address.svg', width: 20 },
    drivingLicense: { label: 'License', icon: '/license.svg', width: 20 },
    linkedIn: { label: 'LinkedIn Label', icon: '/linkedin.svg', width: 20, url: 'https://linkedin.com/in/test' },
    gitHub: { label: 'GitHub Label', icon: '/github.svg', width: 20, url: 'https://github.com/test' },
    blog: { label: 'Blog Label', icon: '/blog.svg', width: 20, url: 'https://blog.example.com' },
    languages: [],
};

async function renderHeader(minimalMode?: boolean) {
    const { useProfile } = await import('../profile/profile.init');
    vi.mocked(useProfile).mockReturnValue(PROFILE);
    return render(<Header minimalMode={minimalMode} />);
}

describe('Header in normal mode', () => {
    it('renders the theme toggle, language selector, and every profile link', async () => {
        await renderHeader(false);

        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
        expect(screen.getByTestId('language-selector')).toBeInTheDocument();
        expect(screen.getByText('Email Label')).toBeInTheDocument();
        expect(screen.getByText('LinkedIn Label')).toBeInTheDocument();
        expect(screen.getByText('GitHub Label')).toBeInTheDocument();
        expect(screen.getByText('Blog Label')).toBeInTheDocument();
        expect(screen.getByText('Gent')).toBeInTheDocument();
    });
});

describe('Header in minimal mode', () => {
    it('keeps the name, email, GitHub, and blog links', async () => {
        await renderHeader(true);

        expect(screen.getByRole('heading', { level: 2, name: 'Test User' })).toBeInTheDocument();
        expect(screen.getByText('Email Label')).toBeInTheDocument();
        expect(screen.getByText('GitHub Label')).toBeInTheDocument();
        expect(screen.getByText('Blog Label')).toBeInTheDocument();
    });

    it('hides the theme toggle, language selector, LinkedIn, and address links', async () => {
        await renderHeader(true);

        expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
        expect(screen.queryByTestId('language-selector')).not.toBeInTheDocument();
        expect(screen.queryByText('LinkedIn Label')).not.toBeInTheDocument();
        expect(screen.queryByText('Gent')).not.toBeInTheDocument();
    });
});
