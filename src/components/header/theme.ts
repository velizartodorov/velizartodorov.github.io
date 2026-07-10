import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function readStoredTheme(): Theme | null {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === 'light' || v === 'dark' ? v : null;
    } catch {
        return null;
    }
}
function currentTheme(): Theme {
    if (typeof document === 'undefined') return 'light';
    return (document.documentElement.dataset.bsTheme as Theme) || 'light';
}

function applyTheme(theme: Theme) {
    document.documentElement.dataset.bsTheme = theme;
}

export function useTheme(): { theme: Theme; toggle: () => void } {
    // Static export always prerenders as 'light' (no access to the client's stored theme),
    // so the client's first render must match that to avoid a hydration mismatch. The inline
    // FOUC-prevention script in the root layout already applied the real theme to the DOM
    // before this runs; syncing it into state here is a normal post-hydration update, not a
    // mismatch, so it doesn't retrigger the flash the FOUC script was written to prevent.
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        setTheme(currentTheme());

        if (readStoredTheme() !== null) return;
        const mq = globalThis.matchMedia('(prefers-color-scheme: dark)');
        const onChange = () => {
            if (readStoredTheme() !== null) return;
            const next: Theme = mq.matches ? 'dark' : 'light';
            applyTheme(next);
            setTheme(next);
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const toggle = useCallback(() => {
        const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
        const root = document.documentElement;
        root.classList.add('theme-switching');
        applyTheme(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore
        }
        setTheme(next);
        globalThis.setTimeout(() => {
            root.classList.remove('theme-switching');
        }, 300);
    }, []);

    return { theme, toggle };
}
