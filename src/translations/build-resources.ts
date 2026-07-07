interface EmploymentsIndex {
    title: string;
    list: string[];
}

export function buildEmployments(index: EmploymentsIndex, items: Record<string, unknown>) {
    return {
        title: index.title,
        list: index.list.map((fileName) => items[fileName]).filter(Boolean),
    };
}

interface EmploymentsModules {
    employmentsIndex: EmploymentsIndex;
    employmentItems: Record<string, unknown>;
}

// Assembles one language's full resources object from its already-imported JSON modules. The
// imports themselves can't be factored out here (static ES imports need literal per-language
// paths for code-splitting), but this shared shape keeps en.ts/nl.ts from re-deriving the same
// employmentItems-map-then-resources-object boilerplate independently.
//
// Generic over T so each caller's individual JSON module types (e.g. profile.json's actual
// shape) pass through untouched instead of collapsing to `unknown` — page.tsx reads
// `resources.profile.name`, which needs profile's real inferred type to type-check.
export function buildLanguageResources<T extends EmploymentsModules>(modules: T) {
    const { employmentsIndex, employmentItems, ...rest } = modules;
    return {
        ...rest,
        employments: buildEmployments(employmentsIndex, employmentItems),
    };
}
