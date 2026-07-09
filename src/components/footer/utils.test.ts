import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCurrentYear } from './utils';

const CACHE_KEY = 'currentYearWithTZ';

beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('useCurrentYear', () => {
    it('uses the cached year/timeZone without fetching when the cache is for the current year', async () => {
        const thisYear = new Date().getFullYear();
        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ year: thisYear, timeZone: 'Europe/Brussels', fetchedAt: Date.now() }),
        );

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(thisYear));
        expect(result.current.timeZone).toBe('Europe/Brussels');
        expect(fetch).not.toHaveBeenCalled();
    });

    it('ignores a stale cache from a previous year and fetches fresh data', async () => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ year: 1999, timeZone: 'Europe/Brussels', fetchedAt: 0 }));
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ year: 2030 }),
        } as Response);

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(2030));
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('ignores an unparseable cache entry and fetches fresh data', async () => {
        localStorage.setItem(CACHE_KEY, '{not valid json');
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ year: 2031 }),
        } as Response);

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(2031));
    });

    it('fetches, exposes the resolved year/timeZone, and caches the result', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ year: 2032 }),
        } as Response);

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(2032));
        expect(result.current.timeZone).toBeTruthy();
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://timeapi.io/api/Time/current/zone?timeZone='),
        );

        const cached = JSON.parse(localStorage.getItem(CACHE_KEY)!);
        expect(cached.year).toBe(2032);
    });

    it('falls back to the local current year when the fetch response is not ok', async () => {
        vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(new Date().getFullYear()));
    });

    it('falls back to the local current year when the fetch itself rejects', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('network down'));

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(new Date().getFullYear()));
    });
});
