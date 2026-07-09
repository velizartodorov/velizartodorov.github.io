import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './theme_toggle';

function mockMatchMedia() {
    vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({
            matches: false,
            media: '(prefers-color-scheme: dark)',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        })),
    );
}

beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.bsTheme;
    mockMatchMedia();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('ThemeToggle', () => {
    it('renders as the light-theme state by default', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: 'Switch to dark theme' });
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).toHaveAttribute('title', 'Switch to dark theme');
    });

    it('switches to the dark-theme state when clicked', async () => {
        render(<ThemeToggle />);

        await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

        const button = screen.getByRole('button', { name: 'Switch to light theme' });
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });
});
