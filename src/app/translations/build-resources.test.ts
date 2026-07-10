import { describe, expect, it } from 'vitest';
import { buildEducation, buildEmployments, buildLanguageResources } from './build-resources';
import {
    assembledEmployment,
    frontmatterEmployment,
    frontmatterIndex,
} from '../../test-utils/build-resources-fixtures';

describe('buildEmployments', () => {
    it('splits the raw body by the position delimiter and assigns one segment per position', () => {
        const result = buildEmployments(frontmatterIndex({ list: ['acme.md'] }), {
            'acme.md': frontmatterEmployment(),
        } as never);

        expect(result).toEqual({ title: 'Employments', list: [assembledEmployment()] });
    });

    it('throws when the body has a different number of segments than positions', () => {
        expect(() =>
            buildEmployments(frontmatterIndex({ list: ['acme.md'] }), {
                'acme.md': frontmatterEmployment({ type: '', body: 'Only one segment, no delimiter' }),
            } as never),
        ).toThrow(/found 1 position body segment\(s\) but 2 position\(s\)/);
    });

    it('filters out index entries with no matching item', () => {
        const result = buildEmployments(frontmatterIndex({ list: ['missing.md'] }), {} as never);
        expect(result.list).toEqual([]);
    });
});

describe('buildEducation', () => {
    it('maps the index list to the matching items, preserving order', () => {
        const result = buildEducation(frontmatterIndex({ title: 'Education', list: ['b.md', 'a.md'] }), {
            'a.md': { occupation: 'A' },
            'b.md': { occupation: 'B' },
        } as never);
        expect(result).toEqual({ title: 'Education', list: [{ occupation: 'B' }, { occupation: 'A' }] });
    });

    it('filters out index entries with no matching item', () => {
        const result = buildEducation(frontmatterIndex({ title: 'Education', list: ['missing.md'] }), {} as never);
        expect(result.list).toEqual([]);
    });
});

describe('buildLanguageResources', () => {
    it('assembles employments and education alongside the passed-through fields', () => {
        const result = buildLanguageResources({
            employmentsIndex: frontmatterIndex({ list: [] }),
            employmentItems: {},
            educationIndex: frontmatterIndex({ title: 'Education', list: [] }),
            educationItems: {},
            profile: { name: 'Test' },
        } as never);

        expect(result).toEqual({
            profile: { name: 'Test' },
            employments: { title: 'Employments', list: [] },
            education: { title: 'Education', list: [] },
        });
    });
});
