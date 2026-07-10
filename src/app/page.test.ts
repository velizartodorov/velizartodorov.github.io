import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { generateMetadata as generateEnMetadata } from './page';
import { generateMetadata as generateNlMetadata } from './nl/page';
import EnPage from './page';
import NlPage from './nl/page';
import { mockMatchMedia } from '../test-utils/mock-match-media';

// The rendered page includes the real ThemeToggle, whose useTheme() hook needs
// matchMedia — jsdom doesn't implement it.
beforeEach(() => {
    mockMatchMedia();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const SITE_URL = 'https://velizartodorov.github.io';
const EN_URL = `${SITE_URL}/`;
const NL_URL = `${SITE_URL}/nl/`;
const IMAGE_URL = `${SITE_URL}/header/velizar.jpg`;
const IMAGE_ALT = "Velizar Todorov's profile photo";
const OG_TITLE = "Velizar Todorov's Portfolio";
const OG_DESCRIPTION = "Check out Velizar Todorov's portfolio and projects.";
const HREFLANG_ALTERNATES = { en: EN_URL, nl: NL_URL, 'x-default': EN_URL };

describe('page metadata', () => {
    it('sets English canonical and hreflang alternates', async () => {
        const enMetadata = await generateEnMetadata();
        expect(enMetadata.title).toBe('Velizar Todorov');
        expect(enMetadata.alternates?.canonical).toBe(EN_URL);
        expect(enMetadata.alternates?.languages).toEqual(HREFLANG_ALTERNATES);
    });

    it('sets Dutch canonical and hreflang alternates', async () => {
        const nlMetadata = await generateNlMetadata();
        expect(nlMetadata.title).toBe('Velizar Todorov');
        expect(nlMetadata.alternates?.canonical).toBe(NL_URL);
        expect(nlMetadata.alternates?.languages).toEqual(HREFLANG_ALTERNATES);
    });

    it('sets an alt-texted Open Graph image and a matching Twitter Card', async () => {
        const enMetadata = await generateEnMetadata();
        expect(enMetadata.openGraph?.images).toEqual([{ url: IMAGE_URL, alt: IMAGE_ALT }]);
        expect(enMetadata.twitter).toEqual({
            card: 'summary_large_image',
            title: OG_TITLE,
            description: OG_DESCRIPTION,
            images: [IMAGE_URL],
        });
    });
});

describe('page components', () => {
    it('renders the English page with English initial language', async () => {
        render(await EnPage());

        expect(document.documentElement.lang).toBe('en');
        expect(screen.getByRole('heading', { level: 2, name: 'Velizar Todorov' })).toBeInTheDocument();
    });

    it('renders the Dutch page with Dutch initial language', async () => {
        render(await NlPage());

        expect(document.documentElement.lang).toBe('nl');
    });
});
