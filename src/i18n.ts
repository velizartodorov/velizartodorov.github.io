import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export type Language = 'en' | 'nl';

// Single source of truth for the set of supported languages, so call sites that need "the other
// language(s)" (e.g. prefetching) don't each hardcode their own two-way assumption.
export const LANGUAGES: readonly Language[] = ['en', 'nl'];

export function otherLanguages(lang: Language): Language[] {
    return LANGUAGES.filter((other) => other !== lang);
}

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

// Tracks in-flight loads per instance+language so concurrent callers (e.g. a prefetch effect
// racing a `?lang=` redirect, or React StrictMode's dev-only double-invoke) share one load
// instead of each re-running the dynamic import and the resource-bundle merge.
const pendingLoads = new WeakMap<typeof i18n, Map<Language, Promise<void>>>();

// Async: used when switching to the OTHER language on demand, so its translation payload is
// only fetched if/when the visitor actually toggles languages, instead of shipping both
// languages' data to every visitor regardless of which one they view.
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
            const { loadResources } = await import('./translations/resources');
            const resources = await loadResources(lang);
            addLanguageResources(instance, lang, resources as NamespaceResources);
        })();
        const settled = pending;
        // Use `.then` with both handlers (not `.finally`) so this cleanup doesn't produce its own
        // unhandled-rejection chain: `.finally` re-throws the original error into its returned
        // promise, which nothing here awaits or catches, while `.then(onFulfilled, onRejected)`
        // resolves as long as neither handler itself throws.
        promise.then(
            () => settled.delete(lang),
            () => settled.delete(lang),
        );
        pending.set(lang, promise);
    }
    return promise;
}

export default i18n;
