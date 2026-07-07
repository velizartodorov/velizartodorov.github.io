import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortfolioApp } from './App';
import { resources as enResources } from './translations/en';
import { resources as nlResources } from './translations/nl';

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
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);
        expect(document.documentElement.lang).toBe('en');
        expect(screen.getByRole('heading', { level: 2, name: 'Velizar Todorov' })).toBeInTheDocument();
    });

    it('renders Dutch content and sets document.documentElement.lang', () => {
        render(<PortfolioApp initialLang="nl" initialResources={nlResources} />);
        expect(document.documentElement.lang).toBe('nl');
    });
});

describe('language switching', () => {
    it('switches to Dutch and updates the URL when NL is clicked from English', async () => {
        const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);

        await userEvent.click(screen.getByRole('button', { name: 'NL' }));

        // Switching lazy-loads the other language's data via a dynamic import, so the update
        // lands a tick or two after the click resolves rather than perfectly synchronously.
        await waitFor(() => expect(document.documentElement.lang).toBe('nl'));
        expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/nl/');
        replaceStateSpy.mockRestore();
    });

    it('switches to English and updates the URL when EN is clicked from Dutch', async () => {
        const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
        render(<PortfolioApp initialLang="nl" initialResources={nlResources} />);

        await userEvent.click(screen.getByRole('button', { name: 'EN' }));

        await waitFor(() => expect(document.documentElement.lang).toBe('en'));
        expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/');
        replaceStateSpy.mockRestore();
    });

    it('marks the NL button pressed when the initial language is nl', () => {
        render(<PortfolioApp initialLang="nl" initialResources={nlResources} />);
        expect(screen.getByRole('button', { name: 'NL' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('marks the EN button pressed when the initial language is en', () => {
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);
        expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    });
});

describe('language switching performance', () => {
    // Adjust this if the toggle's legitimate cost changes (e.g. new work added to the switch
    // path) rather than loosening it to silence a real regression.
    const TOGGLE_TIME_THRESHOLD_MS = 200;

    it(`switches language in under ${TOGGLE_TIME_THRESHOLD_MS}ms (median of several toggles)`, async () => {
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);

        // A single measurement is prone to one-off scheduling/GC noise in the test environment;
        // take the median across several toggles so an isolated blip doesn't fail the run while a
        // genuine regression (which slows down every toggle) still gets caught.
        const targets = ['nl', 'en', 'nl', 'en', 'nl'] as const;
        const samples: number[] = [];

        for (const target of targets) {
            const start = performance.now();
            await userEvent.click(screen.getByRole('button', { name: target.toUpperCase() }));
            await waitFor(() => expect(document.documentElement.lang).toBe(target));
            samples.push(performance.now() - start);
        }

        const median = [...samples].sort((a, b) => a - b)[Math.floor(samples.length / 2)];

        expect(median).toBeLessThan(TOGGLE_TIME_THRESHOLD_MS);
    });
});
