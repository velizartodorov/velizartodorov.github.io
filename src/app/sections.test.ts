import { describe, expect, it } from 'vitest';
import { isSectionSlug, sectionFromPathname, sectionPath, SECTIONS } from './sections';

describe('isSectionSlug', () => {
    it.each(SECTIONS.map((section) => ({ section })))('returns true for "$section"', ({ section }) => {
        expect(isSectionSlug(section)).toBe(true);
    });

    it('returns false for an unknown value', () => {
        expect(isSectionSlug('nope')).toBe(false);
    });
});

describe('sectionPath', () => {
    it('returns the English root for no section', () => {
        expect(sectionPath('en')).toBe('/');
    });

    it('returns the Dutch root for no section', () => {
        expect(sectionPath('nl')).toBe('/nl/');
    });

    it('returns the English section path', () => {
        expect(sectionPath('en', 'experience')).toBe('/experience/');
    });

    it('returns the Dutch section path', () => {
        expect(sectionPath('nl', 'experience')).toBe('/nl/experience/');
    });
});

describe('sectionFromPathname', () => {
    it('returns undefined for the English root', () => {
        expect(sectionFromPathname('/')).toBeUndefined();
    });

    it('returns undefined for the Dutch root', () => {
        expect(sectionFromPathname('/nl/')).toBeUndefined();
    });

    it('returns the slug for an English section path', () => {
        expect(sectionFromPathname('/experience/')).toBe('experience');
    });

    it('returns the slug for a Dutch section path', () => {
        expect(sectionFromPathname('/nl/experience/')).toBe('experience');
    });

    it('returns undefined for an unrelated path', () => {
        expect(sectionFromPathname('/some-other-page/')).toBeUndefined();
    });
});
