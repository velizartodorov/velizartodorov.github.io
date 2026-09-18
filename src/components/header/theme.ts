import { useEffect, useState, useCallback } from 'react';
import { THEME_ATTR, THEME_STORAGE_KEY, THEME_SWITCHING_CLASS, THEME_TRANSITION_MS } from './theme_constants';

export { THEME_ATTR, THEME_STORAGE_KEY, THEME_SWITCHING_CLASS, THEME_TRANSITION_MS } from './theme_constants';

export type Theme = 'light' | 'dark';

function readStoredTheme(): Theme | null {
    try {
        const v = localStorage.getItem(THEME_STORAGE_KEY);
        return v === 'light' || v === 'dark' ? v : null;
    } catch {
        return null;
    }
}
function currentTheme(): Theme {
    if (typeof document === 'undefined') return 'light';
    return (document.documentElement.getAttribute(THEME_ATTR) as Theme) || 'light';
}

function applyTheme(theme: Theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
}

export function useTheme(): { theme: Theme; toggle: () => void } {
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
        root.classList.add(THEME_SWITCHING_CLASS);
        applyTheme(next);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {}
        setTheme(next);
        globalThis.setTimeout(() => {
            root.classList.remove(THEME_SWITCHING_CLASS);
        }, THEME_TRANSITION_MS);
    }, []);

    return { theme, toggle };
}
