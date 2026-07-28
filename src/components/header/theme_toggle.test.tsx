import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle, { THEME_TOGGLE_LABEL } from './theme_toggle';
import { THEME_ATTR } from './theme';
import { mockMatchMedia } from '../../test-utils/mock-match-media';

beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute(THEME_ATTR);
    mockMatchMedia();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('ThemeToggle', () => {
    it('renders as the light-theme state by default', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('button', { name: THEME_TOGGLE_LABEL.light });
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).toHaveAttribute('title', THEME_TOGGLE_LABEL.light);
    });

    it('switches to the dark-theme state when clicked', async () => {
        render(<ThemeToggle />);

        await userEvent.click(screen.getByRole('button', { name: THEME_TOGGLE_LABEL.light }));

        const button = screen.getByRole('button', { name: THEME_TOGGLE_LABEL.dark });
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });
});
