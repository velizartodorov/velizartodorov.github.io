import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { generateMetadata, generateStaticParams } from './page';
import SectionPage from './page';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { loadResources } from '../translations/resources';
import { SECTION_RESOURCE_KEY, SECTIONS } from '../sections';
import { HREFLANG_ALTERNATES, OG_TITLE } from '../metadata';

beforeEach(() => {
    mockMatchMedia();
    mockIntersectionObserver();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const { en: EN_URL } = HREFLANG_ALTERNATES;

function params(section: string) {
    return Promise.resolve({ section });
}

describe('generateStaticParams', () => {
    it('returns one entry per known section slug', () => {
        expect(generateStaticParams()).toEqual(SECTIONS.map((section) => ({ section })));
    });
});

describe('section page metadata', () => {
    it('sets the canonical URL, hreflang alternates, site title, and section-specific OpenGraph title for each section', async () => {
        const resources = await loadResources('en');
        for (const section of SECTIONS) {
            const metadata = await generateMetadata({ params: params(section) });
            const sectionTitle = resources[SECTION_RESOURCE_KEY[section]].title;
            expect(metadata.title).toBe(resources.profile.name);
            expect(metadata.openGraph?.title).toBe(`${OG_TITLE} — ${sectionTitle}`);
            // Section pages canonicalize to the site root (same document as "/", just scrolled to
            // a different position) rather than to themselves - see src/app/metadata.ts.
            expect(metadata.alternates?.canonical).toBe(EN_URL);
            expect(metadata.alternates?.languages).toEqual(HREFLANG_ALTERNATES);
        }
    });
});

describe('section page component', () => {
    // Renders the full PortfolioApp tree once per section (5x total); under the full
    // `vitest run --coverage` suite (v8 instrumentation + many parallel test files, the exact
    // conditions build-deploy.yml/sonarcloud.yml run in CI) this reliably exceeds Vitest's 5000ms
    // default, so it gets the same explicit timeout precedent already used for other legitimately
    // slow tests in this repo (src/links.test.ts, src/analytics.test.ts).
    it(
        'renders the full one-pager, scrolled to the requested section, for each slug',
        { timeout: 15_000 },
        async () => {
            const resources = await loadResources('en');
            for (const section of SECTIONS) {
                const el = document.createElement('div');
                el.id = section;
                el.scrollIntoView = vi.fn();
                document.body.appendChild(el);

                const { unmount } = render(await SectionPage({ params: params(section) }));

                expect(document.documentElement.lang).toBe('en');
                expect(screen.getByRole('heading', { level: 2, name: resources.profile.name })).toBeInTheDocument();
                expect(el.scrollIntoView).toHaveBeenCalledWith({ block: 'start' });

                unmount();
                el.remove();
            }
        },
    );
});
