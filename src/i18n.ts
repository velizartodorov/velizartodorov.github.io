import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type Language = 'en' | 'nl';

const NAMESPACES = [
    'common',
    'employments',
    'education',
    'licenses_certifications',
    'profile',
    'languages',
    'presentations',
    'introduction',
    'dates',
] as const;

type NamespaceResources = Partial<Record<(typeof NAMESPACES)[number], unknown>>;

i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    ns: NAMESPACES,
    defaultNS: 'common',
    resources: {},
    interpolation: { escapeValue: false },
});

function addLanguageResources(instance: typeof i18n, lang: Language, resources: NamespaceResources) {
    for (const ns of NAMESPACES) {
        const data = resources[ns];
        if (data) instance.addResourceBundle(lang, ns, data, true, true);
    }
}

// Synchronous: used for the initial language. Its resources are passed down as a prop from
// the (server-rendered) page component, since each static page already only computes its own
// language's data at build time — no dynamic import needed, and no extra network round trip.
export function createLangInstance(lang: Language, resources: NamespaceResources) {
    // Fork the resource store so this clone's added bundles never leak into the shared base
    // instance (or any other clone) — without this, cloneInstance shares one mutable store by
    // reference, which contaminates other instances/tests created from the same base i18n.
    const instance = i18n.cloneInstance({ lng: lang, forkResourceStore: true });
    addLanguageResources(instance, lang, resources);
    return instance;
}

const LANGUAGE_LOADERS: Record<Language, () => Promise<{ resources: NamespaceResources }>> = {
    en: () => import('./translations/en'),
    nl: () => import('./translations/nl'),
};

// Async: used when switching to the OTHER language on demand, so its translation payload is
// only fetched if/when the visitor actually toggles languages, instead of shipping both
// languages' data to every visitor regardless of which one they view.
export async function loadLanguage(instance: typeof i18n, lang: Language): Promise<void> {
    if (instance.hasResourceBundle(lang, 'common')) return;
    const { resources } = await LANGUAGE_LOADERS[lang]();
    addLanguageResources(instance, lang, resources);
}

export default i18n;
