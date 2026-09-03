import { useEffect, useState } from 'react';

export const YEAR_CACHE_KEY = 'currentYearWithTZ';
export const TIME_API_BASE_URL = 'https://timeapi.io/api/Time/current/zone';

type CacheData = {
    year: number;
    timeZone: string;
    fetchedAt: number;
};

export function useCurrentYear(): {
    year: number | null;
    timeZone: string | null;
} {
    const [year, setYear] = useState<number | null>(null);
    const [timeZone, setTimeZone] = useState<string | null>(null);

    useEffect(() => {
        const cached = localStorage.getItem(YEAR_CACHE_KEY);
        if (cached) {
            try {
                const data: CacheData = JSON.parse(cached);
                const now = new Date();
                if (now.getFullYear() === data.year) {
                    setYear(data.year);
                    setTimeZone(data.timeZone);
                    return;
                }
            } catch {}
        }

        fetchYearFromAPI();
    }, []);

    return { year, timeZone };

    function fetchYearFromAPI() {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        setTimeZone(timeZone);

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
            .catch(() => {
                setYear(new Date().getFullYear());
            });
    }
}
