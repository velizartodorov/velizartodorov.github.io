import type { Language } from './translations/i18n';

export const SECTIONS = ['employments', 'certifications', 'presentations', 'languages', 'education'] as const;

export type SectionSlug = (typeof SECTIONS)[number];

export function isSectionSlug(value: string): value is SectionSlug {
    return (SECTIONS as readonly string[]).includes(value);
}

export const SECTION_RESOURCE_KEY = {
    employments: 'employments',
    certifications: 'licenses_certifications',
    presentations: 'presentations',
    languages: 'languages',
    education: 'education',
} as const satisfies Record<SectionSlug, string>;

export function sectionPath(lang: Language, section?: SectionSlug): string {
    const prefix = lang === 'nl' ? '/nl' : '';
    return section ? `${prefix}/${section}/` : `${prefix}/`;
}

export function sectionFromPathname(pathname: string): SectionSlug | undefined {
    const segments = pathname.split('/').filter(Boolean);
    const last = segments.at(-1);
    return last !== undefined && isSectionSlug(last) ? last : undefined;
}
