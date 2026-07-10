// The markdown-frontmatter shape produced by loaders/markdown-frontmatter-loader.cjs for one
// employments/<company>.md file — see build-resources.ts's assembleEmployment(), the sole
// consumer, which splits `body` by the position delimiter to derive each position's description.
// Distinct from employment-fixtures.ts's raw shape (which has an inline per-position
// `description`, not a `body` to split) — these are two different layers of the same data.
export interface FrontmatterPosition {
    position: string;
    place: string;
    period: { start: string; end?: string };
}

export interface FrontmatterEmployment {
    company: string;
    icon: string;
    type: string;
    positions: FrontmatterPosition[];
    body: string;
}

export interface FrontmatterIndex {
    title: string;
    list: string[];
}

export function frontmatterPosition(overrides: Partial<FrontmatterPosition> = {}): FrontmatterPosition {
    return { position: 'Engineer', place: 'Remote', period: { start: '2020-01-01' }, ...overrides };
}

export function frontmatterEmployment(overrides: Partial<FrontmatterEmployment> = {}): FrontmatterEmployment {
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
export function frontmatterIndex(overrides: Partial<FrontmatterIndex> = {}): FrontmatterIndex {
    return { title: 'Employments', list: [], ...overrides };
}
