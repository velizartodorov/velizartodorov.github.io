import { FC } from 'react';
import { useTheme } from './theme';

const ThemeToggle: FC = () => {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';
    return (
        <button
            type="button"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-app-border bg-app-surface-alt text-[1.05rem] leading-none text-app-text transition-[background-color,rotate] duration-300 ease-out hover:rotate-[15deg] hover:bg-app-border focus-visible:rotate-[15deg] focus-visible:bg-app-border focus-visible:outline-none"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDark}
            onClick={toggle}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
            <span aria-hidden="true">{isDark ? '☀︎' : '☾'}</span>
        </button>
    );
};

export default ThemeToggle;
