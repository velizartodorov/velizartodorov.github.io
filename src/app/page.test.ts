import { describe, expect, it } from 'vitest';
import { generateMetadata as generateEnMetadata } from './page';
import { generateMetadata as generateNlMetadata } from './nl/page';

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
