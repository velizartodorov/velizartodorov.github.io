import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { useMobileMenu, type MobileMenu } from './use_mobile_menu';

let viewport: ReturnType<typeof mockMatchMedia>;

function attachButtons(menu: MobileMenu) {
    const openButton = document.createElement('button');
    const closeButton = document.createElement('button');
    document.body.append(openButton, closeButton);
    menu.openButtonRef.current = openButton;
    menu.closeButtonRef.current = closeButton;
    return { openButton, closeButton };
}

function renderMobileMenu() {
    const view = renderHook(() => useMobileMenu());
    return { ...view, ...attachButtons(view.result.current) };
}

function pressEscape() {
    act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
}

beforeEach(() => {
    viewport = mockMatchMedia(false);
});

afterEach(() => {
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    delete document.body.dataset.navMenuOpen;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('useMobileMenu', () => {
    it('starts closed', () => {
        const { result } = renderMobileMenu();

        expect(result.current.menuOpen).toBe(false);
    });

    it('opens and closes on demand', () => {
        const { result } = renderMobileMenu();

        act(() => result.current.openMenu());
        expect(result.current.menuOpen).toBe(true);

        act(() => result.current.closeMenu());
        expect(result.current.menuOpen).toBe(false);
    });

    it('locks and flags the body while open, restoring both on close', () => {
        const { result } = renderMobileMenu();

        act(() => result.current.openMenu());
        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.dataset.navMenuOpen).toBe('true');

        act(() => result.current.closeMenu());
        expect(document.body.style.overflow).toBe('');
        expect(document.body.dataset.navMenuOpen).toBeUndefined();
    });

    it('closes when Escape is pressed', () => {
        const { result } = renderMobileMenu();

        act(() => result.current.openMenu());
        pressEscape();

        expect(result.current.menuOpen).toBe(false);
    });

    it('closes when the viewport grows past the md breakpoint', () => {
        const { result } = renderMobileMenu();

        act(() => result.current.openMenu());
        act(() => viewport.fireChange(true));

        expect(result.current.menuOpen).toBe(false);
    });

    it('snaps back shut when opened while the viewport is already at least md wide', () => {
        viewport = mockMatchMedia(true);
        const { result } = renderMobileMenu();

        act(() => result.current.openMenu());

        expect(result.current.menuOpen).toBe(false);
        expect(document.body.style.overflow).toBe('');
    });

    it('moves focus to the close button on open and back to the open button on close', () => {
        const { result, openButton, closeButton } = renderMobileMenu();

        act(() => result.current.openMenu());
        expect(closeButton).toHaveFocus();

        act(() => result.current.closeMenu());
        expect(openButton).toHaveFocus();
    });

    it('does not move focus before the menu has ever opened', () => {
        const { openButton, closeButton } = renderMobileMenu();

        expect(openButton).not.toHaveFocus();
        expect(closeButton).not.toHaveFocus();
    });

    it('restores the body and drops its listeners on unmount while open', () => {
        const removeKeyListener = vi.spyOn(document, 'removeEventListener');
        const { result, unmount } = renderMobileMenu();

        act(() => result.current.openMenu());
        unmount();

        expect(document.body.style.overflow).toBe('');
        expect(document.body.dataset.navMenuOpen).toBeUndefined();
        expect(removeKeyListener).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(viewport.mql.removeEventListener).toHaveBeenCalled();
    });
});
