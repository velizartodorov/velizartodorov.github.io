import { describe, expect, it } from 'vitest';
import { buildEducation, buildEmployments, buildLanguageResources } from './build-resources';

describe('buildEmployments', () => {
    it('splits the raw body by the position delimiter and assigns one segment per position', () => {
        const result = buildEmployments({ title: 'Employments', list: ['acme.md'] }, {
            'acme.md': {
                company: 'Acme',
                icon: '/acme.png',
                type: 'Full-time',
                positions: [
                    { position: 'Engineer', place: 'Remote', period: { start: '2020-01-01' } },
                    { position: 'Senior Engineer', place: 'Remote', period: { start: '2021-01-01' } },
                ],
                body: 'First role description\n\n<!-- position -->\n\nSecond role description',
            },
        } as never);

        expect(result).toEqual({
            title: 'Employments',
            list: [
                {
                    company: 'Acme',
                    icon: '/acme.png',
                    type: 'Full-time',
                    positions: [
                        {
                            position: 'Engineer',
                            place: 'Remote',
                            period: { start: '2020-01-01' },
                            description: 'First role description',
                        },
                        {
                            position: 'Senior Engineer',
                            place: 'Remote',
                            period: { start: '2021-01-01' },
                            description: 'Second role description',
                        },
                    ],
                },
            ],
        });
    });

    it('throws when the body has a different number of segments than positions', () => {
        expect(() =>
            buildEmployments({ title: 'Employments', list: ['acme.md'] }, {
                'acme.md': {
                    company: 'Acme',
                    icon: '/acme.png',
                    type: '',
                    positions: [
                        { position: 'Engineer', place: 'Remote', period: { start: '2020-01-01' } },
                        { position: 'Senior Engineer', place: 'Remote', period: { start: '2021-01-01' } },
                    ],
                    body: 'Only one segment, no delimiter',
                },
            } as never),
        ).toThrow(/found 1 position body segment\(s\) but 2 position\(s\)/);
    });

    it('filters out index entries with no matching item', () => {
        const result = buildEmployments({ title: 'Employments', list: ['missing.md'] }, {} as never);
        expect(result.list).toEqual([]);
    });
});

describe('buildEducation', () => {
    it('maps the index list to the matching items, preserving order', () => {
        const result = buildEducation({ title: 'Education', list: ['b.md', 'a.md'] }, {
            'a.md': { occupation: 'A' },
            'b.md': { occupation: 'B' },
        } as never);
        expect(result).toEqual({ title: 'Education', list: [{ occupation: 'B' }, { occupation: 'A' }] });
    });

    it('filters out index entries with no matching item', () => {
        const result = buildEducation({ title: 'Education', list: ['missing.md'] }, {} as never);
        expect(result.list).toEqual([]);
    });
});

describe('buildLanguageResources', () => {
    it('assembles employments and education alongside the passed-through fields', () => {
        const result = buildLanguageResources({
            employmentsIndex: { title: 'Employments', list: [] },
            employmentItems: {},
            educationIndex: { title: 'Education', list: [] },
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
