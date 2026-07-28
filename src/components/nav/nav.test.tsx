import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangSwitchContext } from '../../app/translations/lang-switch-context';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import Nav from './nav';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));
vi.mock('./use_active_section', () => ({ useActiveSection: vi.fn() }));

import { useActiveSection } from './use_active_section';

const LABELS: Record<string, string> = {
    'introduction:title': 'Introduction 👋',
    'employments:title': 'Employments',
    'licenses_certifications:title': 'Licenses & certifications',
    'presentations:title': 'Presentations',
    'languages:title': 'Languages',
    'education:title': 'Education',
    'common:nav.openMenu': 'Open menu',
    'common:nav.closeMenu': 'Close menu',
};

function renderNav(lang: 'en' | 'nl' = 'en', switchTo = vi.fn()) {
    return render(
        <LangSwitchContext.Provider value={{ lang, switchTo }}>
            <Nav />
        </LangSwitchContext.Provider>,
    );
}

// The overlay's scroll-lock effect queries '(min-width: 768px)' to auto-close itself once the
// viewport grows past `md`; `matches: false` is the narrow-viewport default the menu is used at.
let viewport: ReturnType<typeof mockMatchMedia>;

beforeEach(() => {
    viewport = mockMatchMedia(false);
});

afterEach(() => {
    window.history.pushState({}, '', '/');
    vi.unstubAllGlobals();
});

describe('Nav', () => {
    it('renders a link for each section plus Introduction', () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        expect(screen.getByRole('link', { name: 'Introduction 👋' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Employments' })).toHaveAttribute('href', '/experience/');
        expect(screen.getByRole('link', { name: 'Licenses & certifications' })).toHaveAttribute(
            'href',
            '/certifications/',
        );
        expect(screen.getByRole('link', { name: 'Presentations' })).toHaveAttribute('href', '/presentations/');
        expect(screen.getByRole('link', { name: 'Languages' })).toHaveAttribute('href', '/languages/');
        expect(screen.getByRole('link', { name: 'Education' })).toHaveAttribute('href', '/education/');
    });

    it('prefixes links with /nl when the current language is Dutch', () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav('nl');

        expect(screen.getByRole('link', { name: 'Introduction 👋' })).toHaveAttribute('href', '/nl/');
        expect(screen.getByRole('link', { name: 'Employments' })).toHaveAttribute('href', '/nl/experience/');
    });

    it('marks the active section link with aria-current', () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('experience');
        renderNav();

        expect(screen.getByRole('link', { name: 'Employments' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Introduction 👋' })).not.toHaveAttribute('aria-current');
    });

    it('scrolls to the target section and updates the URL without navigating, on click', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        const experienceEl = document.createElement('div');
        experienceEl.id = 'experience';
        experienceEl.scrollIntoView = vi.fn();
        document.body.appendChild(experienceEl);
        const pushStateSpy = vi.spyOn(window.history, 'pushState');

        renderNav();
        await userEvent.click(screen.getByRole('link', { name: 'Employments' }));

        expect(experienceEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/experience/');

        pushStateSpy.mockRestore();
        experienceEl.remove();
    });

    it('centers items and uses a larger font once there is room for all six on one line', () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        expect(screen.getByRole('list')).toHaveClass('md:justify-center');
        expect(screen.getByRole('link', { name: 'Employments' })).toHaveClass('md:text-base');
    });

    it('lets the wide row scroll horizontally, so six items at the larger font cannot overflow the page', () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        expect(screen.getByRole('list')).toHaveClass('overflow-x-auto');
    });
});

describe('Nav — narrow-viewport menu', () => {
    it('opens the full-screen overlay when the hamburger button is clicked', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

        expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
        expect(screen.getAllByRole('link', { name: 'Employments' })).toHaveLength(1);
    });

    it('closes the overlay when its close button is clicked', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));

        expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    });

    it('closes the overlay when Escape is pressed', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
    });

    it('locks and restores body scroll while the overlay is open', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        expect(document.body.style.overflow).toBe('hidden');

        await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
        expect(document.body.style.overflow).toBe('');
    });

    it('scrolls to the target section, updates the URL, and closes the overlay when an item is clicked', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        const experienceEl = document.createElement('div');
        experienceEl.id = 'experience';
        experienceEl.scrollIntoView = vi.fn();
        document.body.appendChild(experienceEl);
        const pushStateSpy = vi.spyOn(window.history, 'pushState');

        renderNav();
        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        await userEvent.click(screen.getByRole('link', { name: 'Employments' }));

        expect(experienceEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/experience/');
        expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();

        pushStateSpy.mockRestore();
        experienceEl.remove();
    });

    it('closes the overlay and restores scrolling when the viewport grows past the md breakpoint', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
        expect(document.body.style.overflow).toBe('hidden');

        act(() => viewport.fireChange(true));

        // Without this the wide row would stay unrendered (the overlay branch of the ternary won),
        // the overlay itself hidden by `md:hidden`, and the body left scroll-locked.
        expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('');
    });

    it('never opens the overlay when the viewport is already at least md wide', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        viewport = mockMatchMedia(true);
        renderNav();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

        expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
        expect(document.body.style.overflow).toBe('');
    });

    it('gives the overlay links padding so they are comfortable touch targets', async () => {
        mockUseTranslation((key: string) => LABELS[key] ?? key);
        vi.mocked(useActiveSection).mockReturnValue('introduction');
        renderNav();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

        expect(screen.getByRole('link', { name: 'Employments' })).toHaveClass('px-4', 'py-2', 'text-lg');
    });
});
