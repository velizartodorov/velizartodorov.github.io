import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { THEME_ATTR, THEME_STORAGE_KEY, THEME_SWITCHING_CLASS, THEME_TRANSITION_MS, useTheme } from './theme';
import { mockMatchMedia } from '../../test-utils/mock-match-media';

const readAppliedTheme = () => document.documentElement.getAttribute(THEME_ATTR);
const applyTheme = (theme: string) => document.documentElement.setAttribute(THEME_ATTR, theme);

beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute(THEME_ATTR);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('useTheme', () => {
    it('syncs to the theme already applied to the document (set by the FOUC-prevention script)', () => {
        applyTheme('dark');
        mockMatchMedia(false);

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('dark');
    });

    it('defaults to light when no theme is set on the document', () => {
        mockMatchMedia(false);

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe('light');
    });

    it('ignores the OS dark-mode preference', () => {
        const { mql, fireChange } = mockMatchMedia(true);

        const { result } = renderHook(() => useTheme());
        act(() => fireChange(true));

        expect(result.current.theme).toBe('light');
        expect(mql.addEventListener).not.toHaveBeenCalled();
    });

    it('toggle() flips the theme, persists it, and applies a transient theme-switching class', () => {
        vi.useFakeTimers();
        mockMatchMedia(false);
        const { result } = renderHook(() => useTheme());

        act(() => result.current.toggle());

        expect(result.current.theme).toBe('dark');
        expect(readAppliedTheme()).toBe('dark');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
        expect(document.documentElement.classList.contains(THEME_SWITCHING_CLASS)).toBe(true);

        act(() => vi.advanceTimersByTime(THEME_TRANSITION_MS));

        expect(document.documentElement.classList.contains(THEME_SWITCHING_CLASS)).toBe(false);
        vi.useRealTimers();
    });

    it('toggle() back to light works and ignores a localStorage write failure', () => {
        applyTheme('dark');
        mockMatchMedia(false);
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('quota exceeded');
        });
        const { result } = renderHook(() => useTheme());

        act(() => result.current.toggle());

        expect(result.current.theme).toBe('light');
        expect(readAppliedTheme()).toBe('light');
    });
});
