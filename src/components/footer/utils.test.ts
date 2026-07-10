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

    it.each([
        {
            name: 'ignores a stale cache from a previous year and fetches fresh data',
            cachedValue: JSON.stringify({ year: 1999, timeZone: 'Europe/Brussels', fetchedAt: 0 }),
            fetchedYear: 2030,
        },
        {
            name: 'ignores an unparseable cache entry and fetches fresh data',
            cachedValue: '{not valid json',
            fetchedYear: 2031,
        },
    ])('$name', async ({ cachedValue, fetchedYear }) => {
        localStorage.setItem(CACHE_KEY, cachedValue);
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ year: fetchedYear }),
        } as Response);

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(fetchedYear));
        expect(fetch).toHaveBeenCalledTimes(1);
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

    it.each([
        {
            name: 'the fetch response is not ok',
            setupFetch: () => vi.mocked(fetch).mockResolvedValue({ ok: false } as Response),
        },
        {
            name: 'the fetch itself rejects',
            setupFetch: () => vi.mocked(fetch).mockRejectedValue(new Error('network down')),
        },
    ])('falls back to the local current year when $name', async ({ setupFetch }) => {
        setupFetch();

        const { result } = renderHook(() => useCurrentYear());

        await waitFor(() => expect(result.current.year).toBe(new Date().getFullYear()));
    });
});
