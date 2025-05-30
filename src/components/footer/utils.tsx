import { useEffect, useState } from 'react';

const CACHE_KEY = 'currentYearWithTZ';

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
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const data: CacheData = JSON.parse(cached);
        const now = new Date();
        if (now.getFullYear() === data.year) {
          setYear(data.year);
          setTimeZone(data.timeZone);
          return;
        }
      } catch {
      }
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Etc/UTC';
    setTimeZone(timeZone);

    fetch(`https://worldtimeapi.org/api/timezone/${encodeURIComponent(timeZone)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch time');
        return res.json();
      })
      .then(data => {
        const serverDate = new Date(data.datetime);
        const fetchedYear = serverDate.getFullYear();
        setYear(fetchedYear);
        const cacheData: CacheData = {
          year: fetchedYear,
          timeZone: timeZone,
          fetchedAt: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      })
      .catch(() => {
        const fallbackYear = new Date().getFullYear();
        setYear(fallbackYear);
      });
  }, []);

  return { year, timeZone };
}