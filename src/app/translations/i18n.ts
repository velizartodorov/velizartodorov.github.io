import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Language } from './languages';

export { type Language, LANGUAGES, otherLanguages } from './languages';

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

export function createLangInstance(lang: Language, resources: NamespaceResources) {
    const instance = i18n.cloneInstance({ lng: lang, forkResourceStore: true });
    addLanguageResources(instance, lang, resources);
    return instance;
}

const pendingLoads = new WeakMap<typeof i18n, Map<Language, Promise<void>>>();

export function loadLanguage(instance: typeof i18n, lang: Language): Promise<void> {
    if (instance.hasResourceBundle(lang, 'common')) return Promise.resolve();

    let pending = pendingLoads.get(instance);
    if (!pending) {
        pending = new Map();
        pendingLoads.set(instance, pending);
    }

    let promise = pending.get(lang);
    if (!promise) {
        promise = (async () => {
            const { loadResources } = await import('./resources');
            const resources = await loadResources(lang);
            addLanguageResources(instance, lang, resources as NamespaceResources);
        })();
        const settled = pending;
        promise.then(
            () => settled.delete(lang),
            () => settled.delete(lang),
        );
        pending.set(lang, promise);
    }
    return promise;
}

export default i18n;
