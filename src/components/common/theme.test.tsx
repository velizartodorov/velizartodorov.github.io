import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTheme } from './theme';

type Listener = (event: { matches: boolean }) => void;

function mockMatchMedia(initialMatches: boolean) {
    let matches = initialMatches;
    const listeners = new Set<Listener>();
    const mql = {
        get matches() {
            return matches;
        },
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn((_event: string, listener: Listener) => {
            listeners.add(listener);
        }),
        removeEventListener: vi.fn((_event: string, listener: Listener) => {
            listeners.delete(listener);
        }),
    };
    vi.stubGlobal(
        'matchMedia',
        vi.fn(() => mql),
    );
    return {
        mql,
        fireChange(next: boolean) {
            matches = next;
            listeners.forEach((listener) => listener({ matches: next }));
        },
    };
}

beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.bsTheme;
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('useTheme', () => {
    it('syncs to the theme already applied to the document (set by the FOUC-prevention script)', () => {
        document.documentElement.dataset.bsTheme = 'dark';
        mockMatchMedia(false);

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('dark');
    });

    it('defaults to light when no theme is set on the document', () => {
        mockMatchMedia(false);

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('light');
    });

    it('does not listen for OS theme changes when a theme is already stored', () => {
        localStorage.setItem('theme', 'dark');
        const { mql } = mockMatchMedia(false);

        renderHook(() => useTheme());

        expect(mql.addEventListener).not.toHaveBeenCalled();
    });

    it('follows OS theme changes when no theme is stored', () => {
        const { fireChange } = mockMatchMedia(false);

        const { result } = renderHook(() => useTheme());

        act(() => fireChange(true));

        expect(result.current.theme).toBe('dark');
        expect(document.documentElement.dataset.bsTheme).toBe('dark');
    });

    it('follows OS theme changes to light when no theme is stored', () => {
        document.documentElement.dataset.bsTheme = 'dark';
        const { fireChange } = mockMatchMedia(false);

        const { result } = renderHook(() => useTheme());

        act(() => fireChange(false));

        expect(result.current.theme).toBe('light');
        expect(document.documentElement.dataset.bsTheme).toBe('light');
    });

    it('ignores a subsequent OS preference change once the user has explicitly toggled', () => {
        const { fireChange } = mockMatchMedia(false);
        const { result } = renderHook(() => useTheme());

        act(() => result.current.toggle()); // user explicitly picks dark, which stores it
        act(() => fireChange(false)); // OS now reports light, but the explicit choice should win

        expect(result.current.theme).toBe('dark');
    });

    it('stops listening for OS theme changes after unmount', () => {
        const { mql } = mockMatchMedia(false);

        const { unmount } = renderHook(() => useTheme());
        unmount();

        expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('ignores a localStorage read failure and falls back to no stored theme', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('blocked');
        });
        const { mql } = mockMatchMedia(false);

        renderHook(() => useTheme());

        // readStoredTheme() swallows the error and returns null, so the OS-change listener still
        // gets attached (the "no stored theme" path), rather than the hook crashing.
        expect(mql.addEventListener).toHaveBeenCalled();
    });

    it('toggle() flips the theme, persists it, and applies a transient theme-switching class', () => {
        vi.useFakeTimers();
        mockMatchMedia(false);
        const { result } = renderHook(() => useTheme());

        act(() => result.current.toggle());

        expect(result.current.theme).toBe('dark');
        expect(document.documentElement.dataset.bsTheme).toBe('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('theme-switching')).toBe(true);

        act(() => vi.advanceTimersByTime(300));

        expect(document.documentElement.classList.contains('theme-switching')).toBe(false);
        vi.useRealTimers();
    });

    it('toggle() back to light works and ignores a localStorage write failure', () => {
        document.documentElement.dataset.bsTheme = 'dark';
        mockMatchMedia(false);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('quota exceeded');
        });
        const { result } = renderHook(() => useTheme());

        act(() => result.current.toggle());

        expect(result.current.theme).toBe('light');
        expect(document.documentElement.dataset.bsTheme).toBe('light');
    });
});
