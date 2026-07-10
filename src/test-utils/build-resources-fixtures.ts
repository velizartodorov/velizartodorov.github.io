import { buildEmployments, Index, RawEmployment, RawPosition } from '../app/translations/build-resources';

// Builds the markdown-frontmatter shape produced by loaders/markdown-frontmatter-loader.cjs for
// one employments/<company>.md file — reuses build-resources.ts's own Index/RawEmployment/
// RawPosition types (exported for this purpose) rather than a parallel copy. Distinct from
// employment-fixtures.ts's raw shape (which has an inline per-position `description`, not a
// `body` to split) — these are two different layers of the same data.
export function frontmatterPosition(overrides: Partial<RawPosition> = {}): RawPosition {
    return { position: 'Engineer', place: 'Remote', period: { start: '2020-01-01' }, ...overrides };
}

export function frontmatterEmployment(overrides: Partial<RawEmployment> = {}): RawEmployment {
    return {
        company: 'Acme',
        icon: '/acme.png',
        type: 'Full-time',
        positions: [
            frontmatterPosition(),
            frontmatterPosition({ position: 'Senior Engineer', period: { start: '2021-01-01' } }),
        ],
        body: 'First role description\n\n<!-- position -->\n\nSecond role description',
        ...overrides,
    };
}

// A translation index (education.yml/employments.yml's parsed shape: a title plus the ordered
// list of filenames it references).
export function frontmatterIndex(overrides: Partial<Index> = {}): Index {
    return { title: 'Employments', list: [], ...overrides };
}

// The shape assembleEmployment() produces: `body` split into a per-position `description`.
// Derived from the real buildEmployments() (rather than a hand-typed parallel literal/interface)
// so this can never silently desync from frontmatterEmployment()'s own defaults/overrides.
export type AssembledEmployment = ReturnType<typeof buildEmployments>['list'][number];

export function assembledEmployment(overrides: Partial<RawEmployment> = {}): AssembledEmployment {
    const raw = frontmatterEmployment(overrides);
    const { list } = buildEmployments({ title: '', list: ['employment'] }, { employment: raw } as never);
    return list[0]!;
}
