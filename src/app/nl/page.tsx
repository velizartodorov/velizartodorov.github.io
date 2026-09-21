import type { Metadata } from 'next';
import { PortfolioApp } from '../App';
import { loadResources } from '../translations/resources';
import { buildMetadata } from '../metadata';
import { isMinimalMode } from '../feature_flags';
import { RedirectToRoot } from '../redirect_to_root';

export async function generateMetadata(): Promise<Metadata> {
    const resources = await loadResources('nl');
    return buildMetadata({ lang: 'nl', profileName: resources.profile.name });
}

export default async function Page() {
    if (isMinimalMode()) {
        return <RedirectToRoot />;
    }
    const resources = await loadResources('nl');
    return <PortfolioApp initialLang="nl" initialResources={resources} />;
}
