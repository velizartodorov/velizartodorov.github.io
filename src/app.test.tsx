import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortfolioApp } from './App';

vi.mock('./components/introduction/introduction', () => ({ default: () => null }));
vi.mock('./components/employments/employments', () => ({ default: () => null }));
vi.mock('./components/licenses_certifications/licenses_certifications', () => ({
    default: () => null,
}));
vi.mock('./components/presentations/presentations', () => ({ default: () => null }));
vi.mock('./components/languages/languages', () => ({ default: () => null }));
vi.mock('./components/education/education', () => ({ default: () => null }));
// jsdom doesn't implement window.matchMedia; the theme toggle isn't under test here.
vi.mock('./components/common/theme_toggle', () => ({ default: () => null }));

afterEach(() => {
    document.documentElement.lang = 'en';
});

describe('PortfolioApp', () => {
    it('renders English content and sets document.documentElement.lang', () => {
        render(<PortfolioApp initialLang="en" />);
        expect(document.documentElement.lang).toBe('en');
        expect(screen.getByRole('heading', { level: 2, name: 'Velizar Todorov' })).toBeInTheDocument();
    });

    it('renders Dutch content and sets document.documentElement.lang', () => {
        render(<PortfolioApp initialLang="nl" />);
        expect(document.documentElement.lang).toBe('nl');
    });
});

describe('language switching', () => {
    it('switches to Dutch and updates the URL when NL is clicked from English', async () => {
        const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
        render(<PortfolioApp initialLang="en" />);

        await userEvent.click(screen.getByRole('button', { name: 'NL' }));

        expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/nl/');
        expect(document.documentElement.lang).toBe('nl');
        replaceStateSpy.mockRestore();
    });

    it('switches to English and updates the URL when EN is clicked from Dutch', async () => {
        const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
        render(<PortfolioApp initialLang="nl" />);

        await userEvent.click(screen.getByRole('button', { name: 'EN' }));

        expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/');
        expect(document.documentElement.lang).toBe('en');
        replaceStateSpy.mockRestore();
    });

    it('marks the NL button pressed when the initial language is nl', () => {
        render(<PortfolioApp initialLang="nl" />);
        expect(screen.getByRole('button', { name: 'NL' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('marks the EN button pressed when the initial language is en', () => {
        render(<PortfolioApp initialLang="en" />);
        expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    });
});
