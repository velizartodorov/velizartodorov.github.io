import { FC } from 'react';
import { useTheme } from './theme';

export const THEME_TOGGLE_LABEL: Record<'light' | 'dark', string> = {
    light: 'Switch to dark theme',
    dark: 'Switch to light theme',
};

const ThemeToggle: FC = () => {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';
    const label = THEME_TOGGLE_LABEL[theme];
    return (
        <button
            type="button"
            className="border-app-border bg-app-surface-alt text-app-text hover:bg-app-border focus-visible:bg-app-border inline-flex size-9 cursor-pointer items-center justify-center rounded-full border text-[1.05rem] leading-none transition-[background-color,rotate] duration-300 ease-out hover:rotate-15 focus-visible:rotate-15 focus-visible:outline-none"
            aria-label={label}
            aria-pressed={isDark}
            onClick={toggle}
            title={label}
        >
            <span aria-hidden="true">{isDark ? '☀︎' : '☾'}</span>
        </button>
    );
};

export default ThemeToggle;
