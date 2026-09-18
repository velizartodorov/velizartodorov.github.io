import type { Metadata } from 'next';
import { PortfolioApp } from './App';
import { loadResources } from './translations/resources';
import { SECTION_RESOURCE_KEY, SECTIONS, type SectionSlug } from './sections';
import { buildMetadata } from './metadata';
import type { Language } from './translations/i18n';

export function generateStaticParams() {
    return SECTIONS.map((section) => ({ section }));
}

export interface SectionPageProps {
    readonly params: Promise<{ section: string }>;
}

export function sectionMetadata(lang: Language) {
    return async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
        const { section } = await params;
        const slug = section as SectionSlug;
        const resources = await loadResources(lang);
        return buildMetadata({
            lang,
            profileName: resources.profile.name,
            section: slug,
            sectionTitle: resources[SECTION_RESOURCE_KEY[slug]].title,
        });
    };
}

export function sectionPage(lang: Language) {
    return async function SectionPage({ params }: SectionPageProps) {
        const { section } = await params;
        const slug = section as SectionSlug;
        const resources = await loadResources(lang);
        return <PortfolioApp initialLang={lang} initialResources={resources} initialSection={slug} />;
    };
}
