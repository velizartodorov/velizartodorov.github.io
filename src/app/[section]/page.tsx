import type { Metadata } from 'next';
import { PortfolioApp } from '../App';
import { loadResources } from '../translations/resources';
import { SECTION_RESOURCE_KEY, SECTIONS, type SectionSlug } from '../sections';

const SITE_URL = 'https://velizartodorov.github.io';

// The full set of valid section slugs is enumerated below; anything else has no generated file
// under a static export (no server to fall back to), so there's no need for a runtime notFound()
// guard here.
export const dynamicParams = false;

export function generateStaticParams() {
    return SECTIONS.map((section) => ({ section }));
}

interface SectionPageProps {
    params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
    const { section } = await params;
    const slug = section as SectionSlug;
    const resources = await loadResources('en');
    const sectionTitle = resources[SECTION_RESOURCE_KEY[slug]].title;
    return {
        title: `${resources.profile.name} — ${sectionTitle}`,
        description: "Velizar's Portfolio",
        alternates: {
            // Section pages render byte-identical body content to the homepage - only
            // title/OpenGraph differ per section - so they canonicalize to the site root rather
            // than to themselves, avoiding duplicate-content ambiguity for search engines. Title/OG
            // below stay section-specific for link-sharing purposes.
            canonical: `${SITE_URL}/`,
            languages: {
                en: `${SITE_URL}/`,
                nl: `${SITE_URL}/nl/`,
                'x-default': `${SITE_URL}/`,
            },
        },
        openGraph: {
            title: `Velizar Todorov's Portfolio — ${sectionTitle}`,
            description: "Check out Velizar Todorov's portfolio and projects.",
            url: `${SITE_URL}/${slug}/`,
            type: 'website',
            images: [
                {
                    url: `${SITE_URL}/header/velizar.jpg`,
                    alt: "Velizar Todorov's profile photo",
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Velizar Todorov's Portfolio — ${sectionTitle}`,
            description: "Check out Velizar Todorov's portfolio and projects.",
            images: [`${SITE_URL}/header/velizar.jpg`],
        },
    };
}

export default async function SectionPage({ params }: SectionPageProps) {
    const { section } = await params;
    const slug = section as SectionSlug;
    const resources = await loadResources('en');
    return <PortfolioApp initialLang="en" initialResources={resources} initialSection={slug} />;
}
