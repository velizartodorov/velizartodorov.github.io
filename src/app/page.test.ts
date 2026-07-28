import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { generateMetadata as generateEnMetadata } from './page';
import { generateMetadata as generateNlMetadata } from './nl/page';
import EnPage from './page';
import NlPage from './nl/page';
import { mockMatchMedia } from '../test-utils/mock-match-media';
import { mockIntersectionObserver } from '../test-utils/mock-intersection-observer';
import { loadResources } from './translations/resources';
import { SECTIONS } from './sections';
import { HREFLANG_ALTERNATES, OG_DESCRIPTION, OG_IMAGE, OG_TITLE } from './metadata';

// The rendered page includes the real ThemeToggle, whose useTheme() hook needs
// matchMedia — jsdom doesn't implement it. It also includes the real Nav, whose
// scrollspy hook needs IntersectionObserver — jsdom doesn't implement that either.
beforeEach(() => {
    mockMatchMedia();
    mockIntersectionObserver();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const { en: EN_URL, nl: NL_URL } = HREFLANG_ALTERNATES;

describe('page metadata', () => {
    it('sets English canonical and hreflang alternates', async () => {
        const resources = await loadResources('en');
        const enMetadata = await generateEnMetadata();
        expect(enMetadata.title).toBe(resources.profile.name);
        expect(enMetadata.alternates?.canonical).toBe(EN_URL);
        expect(enMetadata.alternates?.languages).toEqual(HREFLANG_ALTERNATES);
    });

    it('sets Dutch canonical and hreflang alternates', async () => {
        const resources = await loadResources('nl');
        const nlMetadata = await generateNlMetadata();
        expect(nlMetadata.title).toBe(resources.profile.name);
        expect(nlMetadata.alternates?.canonical).toBe(NL_URL);
        expect(nlMetadata.alternates?.languages).toEqual(HREFLANG_ALTERNATES);
    });

    it('sets an alt-texted Open Graph image and a matching Twitter Card', async () => {
        const enMetadata = await generateEnMetadata();
        expect(enMetadata.openGraph?.images).toEqual([{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }]);
        expect(enMetadata.twitter).toEqual({
            card: 'summary_large_image',
            title: OG_TITLE,
            description: OG_DESCRIPTION,
            images: [OG_IMAGE.url],
        });
    });
});

describe('page components', () => {
    it('renders the English page with English initial language', async () => {
        const resources = await loadResources('en');
        render(await EnPage());

        expect(document.documentElement.lang).toBe('en');
        expect(screen.getByRole('heading', { level: 2, name: resources.profile.name })).toBeInTheDocument();
    });

    it('renders the Dutch page with Dutch initial language', async () => {
        render(await NlPage());

        expect(document.documentElement.lang).toBe('nl');
    });
});

describe('section anchors', () => {
    it('gives each top-level section its anchor id', async () => {
        render(await EnPage());

        for (const id of ['introduction', ...SECTIONS]) {
            expect(document.getElementById(id)).not.toBeNull();
        }
    });
});

describe('nav', () => {
    it('renders the sticky section nav', async () => {
        render(await EnPage());
        expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
    });
});
