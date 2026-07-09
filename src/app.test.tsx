import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortfolioApp, useLangSwitch } from './App';
import { loadLanguage } from './i18n';
import { loadResources } from './translations/resources';

let enResources: Awaited<ReturnType<typeof loadResources>>;
let nlResources: Awaited<ReturnType<typeof loadResources>>;

beforeAll(async () => {
    enResources = await loadResources('en');
    nlResources = await loadResources('nl');
});

vi.mock('./i18n', async (importOriginal) => {
    const actual = await importOriginal<typeof import('./i18n')>();
    // Spy on the real implementation (rather than replacing it) so every existing test still
    // gets real language-switching behavior; only call-tracking is added.
    return { ...actual, loadLanguage: vi.fn(actual.loadLanguage) };
});

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

describe('language prefetching', () => {
    beforeEach(() => {
        vi.mocked(loadLanguage).mockClear();
    });

    // jsdom's dynamic `import()` resolves from the in-memory module graph, so it can't reproduce
    // real network latency — this test instead asserts the actual contract that matters (the
    // OTHER language's data is requested on mount, before any click), which is what keeps the
    // toggle fast regardless of how slow a real fetch is in production.
    it('prefetches the other language on mount, before any toggle click', () => {
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);
        expect(loadLanguage).toHaveBeenCalledWith(expect.anything(), 'nl');
    });

    it('prefetches English when the initial language is Dutch', () => {
        render(<PortfolioApp initialLang="nl" initialResources={nlResources} />);
        expect(loadLanguage).toHaveBeenCalledWith(expect.anything(), 'en');
    });

    it('logs an error when prefetching the other language fails, without crashing', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.mocked(loadLanguage).mockRejectedValueOnce(new Error('network down'));

        render(<PortfolioApp initialLang="en" initialResources={enResources} />);

        await waitFor(() =>
            expect(consoleError).toHaveBeenCalledWith('Failed to prefetch language "nl":', expect.any(Error)),
        );
        consoleError.mockRestore();
    });
});

describe('?lang= URL parameter backward compat', () => {
    // jsdom's location.search isn't a configurable property (spyOn can't redefine it), but the
    // History API is fully implemented, so pushState is the standard way to change the jsdom
    // URL — and unlike replacing window.location outright, it leaves href/origin/etc. intact,
    // which next/image's <Image> in the header needs.
    function stubSearch(search: string) {
        window.history.pushState({}, '', search || '/');
    }

    afterEach(() => {
        window.history.pushState({}, '', '/');
    });

    it('redirects to Dutch when the URL has ?lang=nl', async () => {
        stubSearch('?lang=nl');

        render(<PortfolioApp initialLang="en" initialResources={enResources} />);

        await waitFor(() => expect(document.documentElement.lang).toBe('nl'));
    });

    it('redirects to English when the URL has ?lang=en', async () => {
        stubSearch('?lang=en');

        render(<PortfolioApp initialLang="nl" initialResources={nlResources} />);

        await waitFor(() => expect(document.documentElement.lang).toBe('en'));
    });

    it('ignores an unrelated query string', () => {
        stubSearch('?foo=bar');

        render(<PortfolioApp initialLang="en" initialResources={enResources} />);

        expect(document.documentElement.lang).toBe('en');
    });

    it('does nothing when there is no query string', () => {
        stubSearch('');

        render(<PortfolioApp initialLang="en" initialResources={enResources} />);

        expect(document.documentElement.lang).toBe('en');
    });
});

describe('useLangSwitch', () => {
    it('throws when called outside a PortfolioApp', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        function Outside() {
            useLangSwitch();
            return null;
        }

        expect(() => render(<Outside />)).toThrow('useLangSwitch must be used within PortfolioApp');

        consoleError.mockRestore();
    });
});

describe('language switching no-op', () => {
    it('does nothing when switching to the language already targeted', async () => {
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);
        await waitFor(() => expect(loadLanguage).toHaveBeenCalled());
        vi.mocked(loadLanguage).mockClear();

        await userEvent.click(screen.getByRole('button', { name: 'EN' }));

        expect(document.documentElement.lang).toBe('en');
        expect(loadLanguage).not.toHaveBeenCalled();
    });
});

describe('language switch failure', () => {
    it('logs an error and rolls back so a retry is not blocked, when switching fails', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);

        // Let the mount-time prefetch settle first, so the mockRejectedValueOnce below targets
        // the upcoming user-triggered switchTo call rather than that prefetch call.
        await waitFor(() => expect(loadLanguage).toHaveBeenCalled());
        vi.mocked(loadLanguage).mockRejectedValueOnce(new Error('boom'));

        await userEvent.click(screen.getByRole('button', { name: 'NL' }));

        await waitFor(() =>
            expect(consoleError).toHaveBeenCalledWith('Failed to switch language to "nl":', expect.any(Error)),
        );
        expect(document.documentElement.lang).toBe('en');

        // The failed switch must roll back its target-language guard so an immediate retry isn't
        // silently swallowed by the "already switching to this language" early return.
        await userEvent.click(screen.getByRole('button', { name: 'NL' }));
        await waitFor(() => expect(document.documentElement.lang).toBe('nl'));

        consoleError.mockRestore();
    });

    it('ignores a switch that gets superseded by a newer one before it resolves', async () => {
        render(<PortfolioApp initialLang="en" initialResources={enResources} />);
        await waitFor(() => expect(loadLanguage).toHaveBeenCalled());

        let resolveFirst!: () => void;
        const pendingLoad = new Promise<void>((resolve) => {
            resolveFirst = resolve;
        });
        vi.mocked(loadLanguage).mockImplementationOnce(() => pendingLoad);

        // Click NL: its loadLanguage() call hangs on pendingLoad until resolved below.
        await userEvent.click(screen.getByRole('button', { name: 'NL' }));
        // Before that resolves, click EN — this supersedes the in-flight NL switch.
        await userEvent.click(screen.getByRole('button', { name: 'EN' }));

        await waitFor(() => expect(document.documentElement.lang).toBe('en'));

        // Now let the superseded NL switch resolve; it must not clobber the newer EN switch.
        resolveFirst();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(document.documentElement.lang).toBe('en');
    });
});
