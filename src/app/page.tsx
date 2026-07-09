import type { Metadata } from 'next';
import { PortfolioApp } from '../App';
import { loadResources } from '../translations/resources';

const SITE_URL = 'https://velizartodorov.github.io';

export async function generateMetadata(): Promise<Metadata> {
    const resources = await loadResources('en');
    return {
        title: resources.profile.name,
        description: "Velizar's Portfolio",
        alternates: {
            canonical: `${SITE_URL}/`,
            languages: {
                en: `${SITE_URL}/`,
                nl: `${SITE_URL}/nl/`,
                'x-default': `${SITE_URL}/`,
            },
        },
        openGraph: {
            title: "Velizar Todorov's Portfolio",
            description: "Check out Velizar Todorov's portfolio and projects.",
            url: `${SITE_URL}/`,
            type: 'website',
            images: [`${SITE_URL}/header/velizar.jpg`],
        },
    };
}

export default async function Page() {
    const resources = await loadResources('en');
    return <PortfolioApp initialLang="en" initialResources={resources} />;
}
