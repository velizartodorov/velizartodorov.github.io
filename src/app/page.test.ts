import { describe, expect, it } from 'vitest';
import { metadata as enMetadata } from './page';
import { metadata as nlMetadata } from './nl/page';

describe('page metadata', () => {
    it('sets English canonical and hreflang alternates', () => {
        expect(enMetadata.title).toBe('Velizar Todorov');
        expect(enMetadata.alternates?.canonical).toBe('https://velizartodorov.github.io/');
        expect(enMetadata.alternates?.languages).toEqual({
            en: 'https://velizartodorov.github.io/',
            nl: 'https://velizartodorov.github.io/nl/',
            'x-default': 'https://velizartodorov.github.io/',
        });
    });

    it('sets Dutch canonical and hreflang alternates', () => {
        expect(nlMetadata.title).toBe('Velizar Todorov');
        expect(nlMetadata.alternates?.canonical).toBe('https://velizartodorov.github.io/nl/');
        expect(nlMetadata.alternates?.languages).toEqual({
            en: 'https://velizartodorov.github.io/',
            nl: 'https://velizartodorov.github.io/nl/',
            'x-default': 'https://velizartodorov.github.io/',
        });
    });
});
