import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LangSwitchContext } from '../../app/translations/lang-switch-context';
import { sectionPath } from '../../app/sections';
import { LANGUAGES, type Language } from '../../app/translations/languages';
import { loadAllStrings } from '../../app/translations/resources';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import Nav from './nav';
import { NAV_ITEMS } from './nav_items';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));
vi.mock('./use_active_section', () => ({ useActiveSection: vi.fn() }));

import { useActiveSection, type ActiveSection } from './use_active_section';

const strings = await loadAllStrings();

// Resolves an i18n key ("namespace:dotted.path") against the real English translation source,
// collapsing whitespace the way Testing Library's accessible-name matching does.
function label(key: string): string {
    return String(strings('en', key)).replace(/\s+/g, ' ').trim();
}

const OPEN_MENU = label('common:nav.openMenu');
const CLOSE_MENU = label('common:nav.closeMenu');
const INTRODUCTION = label('introduction:title');
const EMPLOYMENTS = label('employments:title');

function mockActiveSection(active: ActiveSection = 'introduction') {
    const pinTo = vi.fn();
    vi.mocked(useActiveSection).mockReturnValue({ active, pinTo });
    return pinTo;
}

function navTree(lang: Language, switchTo: () => void) {
    return (
        <LangSwitchContext.Provider value={{ lang, switchTo }}>
            <Nav />
        </LangSwitchContext.Provider>
    );
}

function renderNav(lang: Language = 'en', switchTo = vi.fn()) {
    const view = render(navTree(lang, switchTo));
    return Object.assign(view, { rerenderNav: () => view.rerender(navTree(lang, switchTo)) });
}

function addSection(id: string) {
    const el = document.createElement('div');
    el.id = id;
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);
    return el;
}

const link = (name: string) => screen.getByRole('link', { name });
const openMenu = () => userEvent.click(screen.getByRole('button', { name: OPEN_MENU }));
const closeMenu = () => userEvent.click(screen.getByRole('button', { name: CLOSE_MENU }));
const menuOverlay = () => document.querySelector('[data-state]') as HTMLElement;

// The overlay's scroll-lock effect queries '(min-width: 768px)' to auto-close itself once the
// viewport grows past `md`; `matches: false` is the narrow-viewport default the menu is used at.
let viewport: ReturnType<typeof mockMatchMedia>;

beforeEach(() => {
    viewport = mockMatchMedia(false);
    mockUseTranslation(label);
    mockActiveSection();
});

afterEach(() => {
    window.history.pushState({}, '', '/');
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('Nav', () => {
    it.each(LANGUAGES)('links every nav item to its %s-language section path', (lang) => {
        renderNav(lang);

        for (const { titleKey, slug } of NAV_ITEMS) {
            expect(link(label(titleKey))).toHaveAttribute('href', sectionPath(lang, slug));
        }
    });

    it('marks the active section link with aria-current', () => {
        mockActiveSection('employments');
        renderNav();

        expect(link(EMPLOYMENTS)).toHaveAttribute('aria-current', 'page');
        expect(link(INTRODUCTION)).not.toHaveAttribute('aria-current');
    });

    it('scrolls to the target section, pins it, and updates the URL without navigating, on click', async () => {
        const pinTo = mockActiveSection();
        const employments = addSection('employments');
        const pushStateSpy = vi.spyOn(window.history, 'pushState');

        renderNav();
        await userEvent.click(link(EMPLOYMENTS));

        expect(employments.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        expect(pinTo).toHaveBeenCalledWith('employments');
        expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/employments/');
    });

    it('syncs the URL to the section scrolled into view, without adding history entries', () => {
        const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
        const pushStateSpy = vi.spyOn(window.history, 'pushState');

        const view = renderNav();
        expect(replaceStateSpy).not.toHaveBeenCalled();

        const showActive = (active: ActiveSection) => {
            mockActiveSection(active);
            view.rerenderNav();
        };

        showActive('employments');
        expect(replaceStateSpy).toHaveBeenLastCalledWith(null, '', '/employments/');

        showActive('introduction');
        expect(replaceStateSpy).toHaveBeenLastCalledWith(null, '', '/');

        expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('centers items and uses a larger font once there is room for all six on one line', () => {
        renderNav();

        expect(screen.getByRole('list')).toHaveClass('md:justify-center');
        expect(link(EMPLOYMENTS)).toHaveClass('md:text-base');
    });

    it('lets the wide row scroll horizontally, so six items at the larger font cannot overflow the page', () => {
        renderNav();

        expect(screen.getByRole('list')).toHaveClass('overflow-x-auto');
    });
});

describe('Nav — narrow-viewport menu', () => {
    it('opens the full-screen overlay when the hamburger button is clicked', async () => {
        renderNav();

        expect(screen.queryByRole('button', { name: CLOSE_MENU })).not.toBeInTheDocument();
        await openMenu();

        expect(screen.getByRole('button', { name: CLOSE_MENU })).toBeInTheDocument();
        expect(screen.getAllByRole('link', { name: EMPLOYMENTS })).toHaveLength(1);
    });

    it('closes the overlay when its close button is clicked', async () => {
        renderNav();

        await openMenu();
        await closeMenu();

        expect(screen.queryByRole('button', { name: CLOSE_MENU })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: OPEN_MENU })).toBeInTheDocument();
    });

    it('closes the overlay when Escape is pressed', async () => {
        renderNav();

        await openMenu();
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('button', { name: CLOSE_MENU })).not.toBeInTheDocument();
    });

    it('locks and restores body scroll while the overlay is open', async () => {
        renderNav();

        await openMenu();
        expect(document.body.style.overflow).toBe('hidden');

        await closeMenu();
        expect(document.body.style.overflow).toBe('');
    });

    it('flags the body while the overlay is open so page chrome behind it can be hidden', async () => {
        renderNav();

        await openMenu();
        expect(document.body.dataset.navMenuOpen).toBe('true');

        await closeMenu();
        expect(document.body.dataset.navMenuOpen).toBeUndefined();
    });

    it('scrolls to the target section, updates the URL, and closes the overlay when an item is clicked', async () => {
        const employments = addSection('employments');
        const pushStateSpy = vi.spyOn(window.history, 'pushState');

        renderNav();
        await openMenu();
        await userEvent.click(link(EMPLOYMENTS));

        expect(employments.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/employments/');
        expect(screen.queryByRole('button', { name: CLOSE_MENU })).not.toBeInTheDocument();
    });

    it('closes the overlay and restores scrolling when the viewport grows past the md breakpoint', async () => {
        renderNav();

        await openMenu();
        expect(document.body.style.overflow).toBe('hidden');

        act(() => viewport.fireChange(true));

        // Without this the wide row would stay unrendered (the overlay branch of the ternary won),
        // the overlay itself hidden by `md:hidden`, and the body left scroll-locked.
        expect(screen.queryByRole('button', { name: CLOSE_MENU })).not.toBeInTheDocument();
        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('');
    });

    it('never opens the overlay when the viewport is already at least md wide', async () => {
        viewport = mockMatchMedia(true);
        renderNav();

        await openMenu();

        expect(screen.queryByRole('button', { name: CLOSE_MENU })).not.toBeInTheDocument();
        expect(document.body.style.overflow).toBe('');
    });

    it('keeps the overlay mounted and eases it in and out instead of swapping it instantly', async () => {
        renderNav();

        expect(menuOverlay()).toHaveClass('transition', 'duration-200', 'motion-reduce:transition-none');
        expect(menuOverlay()).toHaveAttribute('data-state', 'closed');
        expect(menuOverlay()).toHaveClass('opacity-0', '-translate-x-2', 'pointer-events-none');

        await openMenu();
        expect(menuOverlay()).toHaveAttribute('data-state', 'open');
        expect(menuOverlay()).toHaveClass('opacity-100', 'translate-x-0');
        expect(menuOverlay()).not.toHaveClass('pointer-events-none');

        await closeMenu();
        expect(menuOverlay()).toHaveAttribute('data-state', 'closed');
        expect(menuOverlay()).toHaveClass('opacity-0', '-translate-x-2');
    });

    it('keeps the closed overlay inert and hidden from assistive tech', () => {
        renderNav();

        expect(menuOverlay()).toHaveAttribute('aria-hidden', 'true');
        expect(menuOverlay()).toHaveAttribute('inert');
    });

    it('takes the nav bar out of the tab order and a11y tree while the overlay is open', async () => {
        renderNav();

        const openButton = screen.getByRole('button', { name: OPEN_MENU });
        const bar = openButton.parentElement as HTMLElement;
        expect(bar).not.toHaveAttribute('inert');

        await userEvent.click(openButton);

        expect(bar).toHaveAttribute('inert');
        expect(bar).toHaveAttribute('aria-hidden', 'true');
    });

    it('moves focus into the overlay when the menu opens, so no focused node is left under inert', async () => {
        renderNav();

        await openMenu();

        expect(screen.getByRole('button', { name: CLOSE_MENU })).toHaveFocus();
    });

    it('returns focus to the hamburger button when the menu closes', async () => {
        renderNav();

        await openMenu();
        await closeMenu();

        expect(screen.getByRole('button', { name: OPEN_MENU })).toHaveFocus();
    });

    it('does not steal focus on the initial render, while the menu has never been opened', () => {
        renderNav();

        expect(document.body).toHaveFocus();
    });

    it('gives the overlay links padding so they are comfortable touch targets', async () => {
        renderNav();

        await openMenu();

        expect(link(EMPLOYMENTS)).toHaveClass('px-4', 'py-3', 'text-lg');
    });
});
