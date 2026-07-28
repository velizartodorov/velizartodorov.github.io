import { describe, expect, it } from 'vitest';
import { loadAllStrings, loadResources } from './resources';
import { LANGUAGES } from './languages';

const strings = await loadAllStrings();
const resources = Object.fromEntries(
    await Promise.all(LANGUAGES.map(async (lang) => [lang, await loadResources(lang)] as const)),
) as Record<(typeof LANGUAGES)[number], Awaited<ReturnType<typeof loadResources>>>;

describe('loadAllStrings', () => {
    it.each(LANGUAGES)("resolves a leaf string for %s the same as that language's resources", (lang) => {
        expect(strings(lang, 'common:poweredBy')).toBe(resources[lang].common.poweredBy);
    });

    it('selects by language, so the two languages can disagree on the same key', () => {
        const en = strings('en', 'common:poweredBy');
        const nl = strings('nl', 'common:poweredBy');
        expect(typeof en).toBe('string');
        expect(typeof nl).toBe('string');
        expect(en).toBe(resources.en.common.poweredBy);
        expect(nl).toBe(resources.nl.common.poweredBy);
    });

    it('returns an array node whole (i18next returnObjects-style), not stringified', () => {
        const months = strings('en', 'common:months');
        expect(Array.isArray(months)).toBe(true);
        expect(months).toEqual(resources.en.common.months);
    });

    it('returns a nested object node whole', () => {
        expect(strings('en', 'common:period')).toEqual(resources.en.common.period);
    });

    it('walks a dotted path to a deep leaf', () => {
        expect(strings('en', 'common:period.at')).toBe(resources.en.common.period.at);
    });

    it('resolves keys in a namespace assembled by buildLanguageResources', () => {
        expect(strings('en', 'employments:title')).toBe(resources.en.employments.title);
    });

    it('returns undefined for a key that does not exist', () => {
        expect(strings('en', 'common:missing.path')).toBeUndefined();
    });
});
