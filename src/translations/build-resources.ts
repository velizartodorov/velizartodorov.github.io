interface Index {
    title: string;
    list: string[];
}

// Raw position frontmatter, before period placeholders (e.g. "{{dates:x}}") are resolved to real
// Dates by useEmployments() - see components/employments/employments.init.ts.
interface RawPosition {
    position: string;
    place: string;
    period: { start: string; end?: string };
}

// Shape produced by loaders/markdown-frontmatter-loader.cjs for one employments/<company>.md:
// frontmatter fields plus `body`, the raw markdown after the closing `---`, with each position's
// description separated by a bare "---" line (see scripts that generated these files).
interface RawEmployment {
    company: string;
    icon: string;
    type: string;
    positions: RawPosition[];
    body: string;
}

const POSITION_DELIMITER = /\n\n---\n\n/;

function assembleEmployment(raw: RawEmployment) {
    const bodies = raw.body.split(POSITION_DELIMITER);
    return {
        company: raw.company,
        icon: raw.icon,
        type: raw.type,
        positions: raw.positions.map((position, i) => ({ ...position, description: bodies[i] ?? '' })),
    };
}

export function buildEmployments(index: Index, items: Record<string, RawEmployment>) {
    return {
        title: index.title,
        list: index.list
            .map((fileName) => items[fileName])
            .filter((item): item is RawEmployment => Boolean(item))
            .map(assembleEmployment),
    };
}

export function buildEducation(index: Index, items: Record<string, unknown>) {
    return {
        title: index.title,
        list: index.list.map((fileName) => items[fileName]).filter(Boolean),
    };
}

interface LanguageModules {
    employmentsIndex: Index;
    employmentItems: Record<string, RawEmployment>;
    educationIndex: Index;
    educationItems: Record<string, unknown>;
}

// Assembles one language's full resources object from its already-imported translation modules.
// The imports themselves can't be factored out here (static ES imports need literal per-language
// paths for code-splitting), but this shared shape keeps en.ts/nl.ts from re-deriving the same
// index-then-items-map boilerplate independently.
//
// Generic over T so each caller's individual namespace types (e.g. profile's actual shape) pass
// through untouched instead of collapsing to `unknown` - page.tsx reads `resources.profile.name`,
// which needs profile's real inferred type to type-check.
export function buildLanguageResources<T extends LanguageModules>(modules: T) {
    const { employmentsIndex, employmentItems, educationIndex, educationItems, ...rest } = modules;
    return {
        ...rest,
        employments: buildEmployments(employmentsIndex, employmentItems),
        education: buildEducation(educationIndex, educationItems),
    };
}
