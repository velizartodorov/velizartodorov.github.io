import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { generateMetadata, generateStaticParams } from './page';
import SectionPage from './page';
import { mockMatchMedia } from '../../../test-utils/mock-match-media';
import { mockIntersectionObserver } from '../../../test-utils/mock-intersection-observer';
import { loadResources } from '../../translations/resources';
import { SECTION_RESOURCE_KEY, SECTIONS } from '../../sections';

beforeEach(() => {
    mockMatchMedia();
    mockIntersectionObserver();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const SITE_URL = 'https://velizartodorov.github.io';
const EN_URL = `${SITE_URL}/`;
const NL_URL = `${SITE_URL}/nl/`;
const HREFLANG_ALTERNATES = { en: EN_URL, nl: NL_URL, 'x-default': EN_URL };

function params(section: string) {
    return Promise.resolve({ section });
}

describe('generateStaticParams', () => {
    it('returns one entry per known section slug', () => {
        expect(generateStaticParams()).toEqual(SECTIONS.map((section) => ({ section })));
    });
});

describe('section page metadata', () => {
    it('sets the Dutch canonical URL, hreflang alternates, and translated title for each section', async () => {
        const resources = await loadResources('nl');
        for (const section of SECTIONS) {
            const metadata = await generateMetadata({ params: params(section) });
            const sectionTitle = resources[SECTION_RESOURCE_KEY[section]].title;
            expect(metadata.title).toBe(`${resources.profile.name} — ${sectionTitle}`);
            // Section pages canonicalize to the site root (same document as "/nl/", just scrolled
            // to a different position) rather than to themselves - see
            // src/app/nl/[section]/page.tsx.
            expect(metadata.alternates?.canonical).toBe(NL_URL);
            expect(metadata.alternates?.languages).toEqual(HREFLANG_ALTERNATES);
        }
    });
});

describe('section page component', () => {
    // Renders the full PortfolioApp tree once per section (5x total); under the full
    // `vitest run --coverage` suite (v8 instrumentation + many parallel test files, the exact
    // conditions build-deploy.yml/sonarcloud.yml run in CI) this reliably exceeds Vitest's 5000ms
    // default, so it gets the same explicit timeout precedent already used for other legitimately
    // slow tests in this repo (src/links.test.ts, src/analytics.test.ts), matching Task 9's
    // identically-shaped test.
    it(
        'renders the full one-pager with Dutch as the initial language, for each slug',
        { timeout: 15_000 },
        async () => {
            for (const section of SECTIONS) {
                const el = document.createElement('div');
                el.id = section;
                el.scrollIntoView = vi.fn();
                document.body.appendChild(el);

                const { unmount } = render(await SectionPage({ params: params(section) }));

                expect(document.documentElement.lang).toBe('nl');
                expect(screen.getByRole('heading', { level: 2, name: 'Velizar Todorov' })).toBeInTheDocument();
                expect(el.scrollIntoView).toHaveBeenCalledWith({ block: 'start' });

                unmount();
                el.remove();
            }
        },
    );
});
