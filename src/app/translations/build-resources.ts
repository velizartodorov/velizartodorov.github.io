import type { Employment, Position } from '../../components/employments/employment';
import type { EducationFile, EmploymentFile } from './resource-files';

// Exported so tests can build fixtures against these shapes directly (see
// src/test-utils/build-resources-fixtures.ts) instead of maintaining a parallel copy.
export interface Index {
    title: string;
    list: string[];
}

// Raw position frontmatter: derived from Position (rather than a hand-copied parallel shape) so
// a field added there is picked up here too, minus `description` (not yet split from `body` - see
// assembleEmployment() below) and with `period` still string-dated, before useEmployments()
// resolves period placeholders (e.g. "{{dates:x}}") to real Dates.
export type RawPosition = Omit<Position, 'period' | 'description'> & { period: { start: string; end?: string } };

// Shape produced by loaders/markdown-frontmatter-loader.cjs for one employments/<company>.md:
// derived from Employment, swapping in RawPosition and adding `body`, the raw markdown after the
// closing `---` with each position's description separated by a bare "---" line (see scripts
// that generated these files).
export type RawEmployment = Omit<Employment, 'positions'> & { positions: RawPosition[]; body: string };

// An HTML comment (not a bare "---") so it can't collide with a real markdown horizontal rule
// that an author might legitimately add inside a single position's own description.
const POSITION_DELIMITER = /\n\n<!-- position -->\n\n/;

function assembleEmployment(raw: RawEmployment) {
    const bodies = raw.body.split(POSITION_DELIMITER);
    if (bodies.length !== raw.positions.length) {
        throw new Error(
            `${raw.company}: found ${bodies.length} position body segment(s) but ${raw.positions.length} ` +
                `position(s) in frontmatter - check the "<!-- position -->" delimiters in the markdown file.`,
        );
    }
    return {
        company: raw.company,
        icon: raw.icon,
        type: raw.type,
        positions: raw.positions.map((position, i) => ({ ...position, description: bodies[i] ?? '' })),
    };
}

export function buildEmployments(index: Index, items: Record<EmploymentFile, RawEmployment>) {
    return {
        title: index.title,
        list: index.list
            .map((fileName) => items[fileName as EmploymentFile])
            .filter((item): item is RawEmployment => Boolean(item))
            .map(assembleEmployment),
    };
}

export function buildEducation(index: Index, items: Record<EducationFile, unknown>) {
    return {
        title: index.title,
        list: index.list.map((fileName) => items[fileName as EducationFile]).filter(Boolean),
    };
}

interface LanguageModules {
    employmentsIndex: Index;
    employmentItems: Record<EmploymentFile, RawEmployment>;
    educationIndex: Index;
    educationItems: Record<EducationFile, unknown>;
}

// Assembles one language's full resources object from its already-loaded translation modules
// (see loadResources() in resources.ts, the sole caller). Kept generic over T so a caller with
// more specific namespace types than LanguageModules requires would have them pass through
// untouched instead of collapsing to `unknown`.
export function buildLanguageResources<T extends LanguageModules>(modules: T) {
    const { employmentsIndex, employmentItems, educationIndex, educationItems, ...rest } = modules;
    return {
        ...rest,
        employments: buildEmployments(employmentsIndex, employmentItems),
        education: buildEducation(educationIndex, educationItems),
    };
}
