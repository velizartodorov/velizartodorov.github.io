import type { Metadata } from 'next';
import { PortfolioApp } from '../App';
import { loadResources } from '../translations/resources';
import { buildMetadata, OG_TITLE } from '../metadata';
import { isMinimalMode } from '../feature_flags';
import { minimalModeRedirect } from '../redirect_to_root';

export async function generateMetadata(): Promise<Metadata> {
    if (isMinimalMode()) {
        return buildMetadata({ lang: 'nl', profileName: OG_TITLE });
    }
    const resources = await loadResources('nl');
    return buildMetadata({ lang: 'nl', profileName: resources.profile.name });
}

export default async function Page() {
    const redirect = minimalModeRedirect('nl');
    if (redirect) return redirect;
    const resources = await loadResources('nl');
    return <PortfolioApp initialLang="nl" initialResources={resources} />;
}
