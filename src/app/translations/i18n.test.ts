import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createLangInstance, loadLanguage, otherLanguages } from './i18n';

vi.mock('./resources', () => ({ loadResources: vi.fn() }));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('otherLanguages', () => {
    it('returns the other supported languages', () => {
        expect(otherLanguages('en')).toEqual(['nl']);
        expect(otherLanguages('nl')).toEqual(['en']);
    });
});

describe('loadLanguage', () => {
    it('is a no-op when the language is already loaded', async () => {
        const instance = createLangInstance('en', { common: { poweredBy: 'x' } });
        const { loadResources } = await import('./resources');

        await loadLanguage(instance, 'en');

        expect(loadResources).not.toHaveBeenCalled();
    });

    it('shares one in-flight load across concurrent callers for the same language', async () => {
        const instance = createLangInstance('en', { common: { poweredBy: 'x' } });
        const { loadResources } = await import('./resources');
        vi.mocked(loadResources).mockResolvedValue({ common: { poweredBy: 'y' } });

        const [first, second] = await Promise.all([loadLanguage(instance, 'nl'), loadLanguage(instance, 'nl')]);

        expect(first).toBe(second);
        expect(loadResources).toHaveBeenCalledTimes(1);
    });

    it('clears the in-flight-load cache after a failure, so a retry re-attempts the load', async () => {
        const instance = createLangInstance('en', { common: { poweredBy: 'x' } });
        const { loadResources } = await import('./resources');
        vi.mocked(loadResources).mockRejectedValueOnce(new Error('network down'));

        await expect(loadLanguage(instance, 'nl')).rejects.toThrow('network down');

        vi.mocked(loadResources).mockResolvedValueOnce({ common: { poweredBy: 'y' } });
        await loadLanguage(instance, 'nl');

        expect(loadResources).toHaveBeenCalledTimes(2);
    });
});
