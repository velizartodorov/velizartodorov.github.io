import { useEffect, useLayoutEffect, useState } from 'react';

export const YEAR_CACHE_KEY = 'currentYearWithTZ';
export const TIME_API_BASE_URL = 'https://timeapi.io/api/Time/current/zone';

const BUILD_YEAR = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || new Date().getFullYear();

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type CacheData = {
    year: number;
    timeZone: string;
    fetchedAt: number;
};

export function useCurrentYear(): {
    year: number;
    timeZone: string | null;
} {
    const [year, setYear] = useState(BUILD_YEAR);
    const [timeZone, setTimeZone] = useState<string | null>(null);

    useIsomorphicLayoutEffect(() => {
        try {
            const cached = localStorage.getItem(YEAR_CACHE_KEY);
            if (cached) {
                const data: CacheData = JSON.parse(cached);
                const now = new Date();
                if (now.getFullYear() === data.year) {
                    setYear(data.year);
                    setTimeZone(data.timeZone);
                    return;
                }
            }
        } catch {}

        fetchYearFromAPI();
    }, []);

    return { year, timeZone };

    function fetchYearFromAPI() {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        setTimeZone(timeZone);
        setYear(new Date().getFullYear());

        fetch(`${TIME_API_BASE_URL}?timeZone=${encodeURIComponent(timeZone)}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch time');
                return res.json();
            })
            .then((data) => {
                const fetchedYear = data.year;
                setYear(fetchedYear);

                const cacheData: CacheData = {
                    year: fetchedYear,
                    timeZone: timeZone,
                    fetchedAt: Date.now(),
                };
                localStorage.setItem(YEAR_CACHE_KEY, JSON.stringify(cacheData));
            })
            .catch(() => {});
    }
}
