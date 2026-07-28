import type { Metadata } from 'next';
import type { Language } from './translations/i18n';
import type { SectionSlug } from './sections';

export const SITE_URL = 'https://velizartodorov.github.io';
export const SITE_DESCRIPTION = "Velizar's Portfolio";
export const OG_TITLE = "Velizar Todorov's Portfolio";
export const OG_DESCRIPTION = "Check out Velizar Todorov's portfolio and projects.";
export const OG_IMAGE = { url: `${SITE_URL}/header/velizar.jpg`, alt: "Velizar Todorov's profile photo" } as const;

export const languageRoot = (lang: Language): string => (lang === 'nl' ? `${SITE_URL}/nl/` : `${SITE_URL}/`);

export const HREFLANG_ALTERNATES = {
    en: languageRoot('en'),
    nl: languageRoot('nl'),
    'x-default': languageRoot('en'),
} as const;

interface BuildMetadataArgs {
    lang: Language;
    profileName: string;
    section?: SectionSlug;
    sectionTitle?: string;
}

export function buildMetadata({ lang, profileName, section, sectionTitle }: BuildMetadataArgs): Metadata {
    const canonical = languageRoot(lang);
    const pageUrl = section ? `${canonical}${section}/` : canonical;
    const ogTitle = sectionTitle ? `${OG_TITLE} — ${sectionTitle}` : OG_TITLE;

    return {
        title: profileName,
        description: SITE_DESCRIPTION,
        alternates: {
            canonical,
            languages: { ...HREFLANG_ALTERNATES },
        },
        openGraph: {
            title: ogTitle,
            description: OG_DESCRIPTION,
            url: pageUrl,
            type: 'website',
            images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: OG_DESCRIPTION,
            images: [OG_IMAGE.url],
        },
    };
}
