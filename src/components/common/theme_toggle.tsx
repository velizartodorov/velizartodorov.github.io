import { FC } from 'react';
import { useTheme } from './theme';
import './theme_toggle.css';

const ThemeToggle: FC = () => {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';
    return (
        <button
            type="button"
            className="theme-toggle"
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
