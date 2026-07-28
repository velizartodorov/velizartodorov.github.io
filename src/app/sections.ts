import type { Language } from './translations/i18n';

// Single source of truth for which sections get their own deep-linkable URL (in both the sticky
// nav and the static /[section] routes) - Introduction has no entry here since it's simply the
// top of the page, reachable at the plain "/" (or "/nl/") root.
export const SECTIONS = ['experience', 'certifications', 'presentations', 'languages', 'education'] as const;

export type SectionSlug = (typeof SECTIONS)[number];

export function isSectionSlug(value: string): value is SectionSlug {
    return (SECTIONS as readonly string[]).includes(value);
}

// Maps each section slug to the key it lives under in the object returned by loadResources() /
// buildLanguageResources(), so server components can read a section's translated title for
// per-route <title>/OpenGraph metadata without importing each section's own React component.
export const SECTION_RESOURCE_KEY = {
    experience: 'employments',
    certifications: 'licenses_certifications',
    presentations: 'presentations',
    languages: 'languages',
    education: 'education',
} as const satisfies Record<SectionSlug, string>;

// Builds the canonical path for a language + optional section, mirroring the "/" vs "/nl/"
// (root) and "/<section>/" vs "/nl/<section>/" pairing that next.config.ts's trailingSlash:
// true / GitHub Pages static export produce.
export function sectionPath(lang: Language, section?: SectionSlug): string {
    const prefix = lang === 'nl' ? '/nl' : '';
    return section ? `${prefix}/${section}/` : `${prefix}/`;
}

// Recovers the section slug (if any) from a pathname such as "/experience/" or
// "/nl/experience/" - the inverse of sectionPath() minus the language, since callers that need
// it (switchTo() in App.tsx) already track language separately.
export function sectionFromPathname(pathname: string): SectionSlug | undefined {
    const segments = pathname.split('/').filter(Boolean);
    const last = segments.at(-1);
    return last !== undefined && isSectionSlug(last) ? last : undefined;
}
