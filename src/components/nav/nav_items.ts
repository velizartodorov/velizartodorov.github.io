import type { SectionSlug } from '../../app/sections';
import type { ActiveSection } from './use_active_section';

export interface NavItem {
    slug?: SectionSlug;
    titleKey: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
    { titleKey: 'introduction:title' },
    { slug: 'employments', titleKey: 'employments:title' },
    { slug: 'certifications', titleKey: 'licenses_certifications:title' },
    { slug: 'presentations', titleKey: 'presentations:title' },
    { slug: 'languages', titleKey: 'languages:title' },
    { slug: 'education', titleKey: 'education:title' },
];

export const sectionOf = (slug?: SectionSlug): ActiveSection => slug ?? 'introduction';
