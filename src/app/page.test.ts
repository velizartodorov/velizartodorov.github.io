import { describe, expect, it } from 'vitest';
import { generateMetadata as generateEnMetadata } from './page';
import { generateMetadata as generateNlMetadata } from './nl/page';

describe('page metadata', () => {
    it('sets English canonical and hreflang alternates', async () => {
        const enMetadata = await generateEnMetadata();
        expect(enMetadata.title).toBe('Velizar Todorov');
        expect(enMetadata.alternates?.canonical).toBe('https://velizartodorov.github.io/');
        expect(enMetadata.alternates?.languages).toEqual({
            en: 'https://velizartodorov.github.io/',
            nl: 'https://velizartodorov.github.io/nl/',
            'x-default': 'https://velizartodorov.github.io/',
        });
    });

    it('sets Dutch canonical and hreflang alternates', async () => {
        const nlMetadata = await generateNlMetadata();
        expect(nlMetadata.title).toBe('Velizar Todorov');
        expect(nlMetadata.alternates?.canonical).toBe('https://velizartodorov.github.io/nl/');
        expect(nlMetadata.alternates?.languages).toEqual({
            en: 'https://velizartodorov.github.io/',
            nl: 'https://velizartodorov.github.io/nl/',
            'x-default': 'https://velizartodorov.github.io/',
        });
    });
});
