import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

type Language = 'en' | 'nl';
const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'nl'] as const;
const DEFAULT_LANGUAGE: Language = 'en';

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

const BUNDLE_OPTIONS: [boolean, boolean] = [true, true];
const addBundle = (lang: Language, ns: string, data: any) =>
    i18n.addResourceBundle(lang, ns, data, ...BUNDLE_OPTIONS);

const isSupportedLang = (lang?: string): lang is Language =>
    !!lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);

const TRANSLATION_PATH_RE = /\/translations\/(?:([^/]+)\/)?([^/]+)\.json$/;
const EMPLOYMENTS_INDEX_RE = /\.\/translations\/([^/]+)\/employments\.json/;
const EMPLOYMENTS_ITEM_LANG_RE = /\.\/translations\/([^/]+)\/employments\//;

const loadAllTranslations = () => {
    const mods = import.meta.glob(
        [
            './translations/**/*.json',
            '!./translations/**/employments/**/*.json',
            './translations/dates.json',
        ],
        { eager: true },
    ) as Record<string, { default: any }>;

    for (const [path, mod] of Object.entries(mods)) {
        const m = TRANSLATION_PATH_RE.exec(path);
        if (!m) continue;
        const [, langMaybe, fileName] = m;
        if (!fileName) continue;
        const lang: Language = isSupportedLang(langMaybe) ? langMaybe : DEFAULT_LANGUAGE;
        if (fileName === 'dates') {
            addBundle(DEFAULT_LANGUAGE, 'dates', mod.default);
            continue;
        }
        if (fileName === 'employments') continue;
        addBundle(lang, fileName.replace(/\.json$/, ''), mod.default);
    }
};

const loadEmployments = () => {
    const indexMods = import.meta.glob('./translations/*/employments.json', {
        eager: true,
    }) as Record<string, { default: any }>;

    const itemMods = import.meta.glob('./translations/*/employments/*.json', {
        eager: true,
    }) as Record<string, { default: any }>;

    const byLang: Record<Language, any> = { en: {}, nl: {} };

    for (const [p, m] of Object.entries(indexMods)) {
        const l = EMPLOYMENTS_INDEX_RE.exec(p)?.[1];
        if (!isSupportedLang(l)) continue;
        byLang[l].index = m.default;
        byLang[l].items = [];
    }

    const filesByLang: Partial<Record<Language, Record<string, any>>> = {};
    for (const [p, m] of Object.entries(itemMods)) {
        const l = EMPLOYMENTS_ITEM_LANG_RE.exec(p)?.[1];
        if (!isSupportedLang(l)) continue;
        const f = p.split('/').pop() || '';
        (filesByLang[l] ||= {})[f] = m.default;
    }

    (Object.entries(byLang) as [Language, any][]).forEach(([lang, data]) => {
        const files = filesByLang[lang];
        if (!data.index || !files) return;
        const ordered = (data.index.list || []).map((f: string) => files[f]).filter(Boolean);
        addBundle(lang, 'employments', {
            title: data.index.title,
            list: ordered,
        });
    });
};

const loadTranslations = () => {
    loadAllTranslations();
    loadEmployments();
};

const initI18n = async () => {
    try {
        i18n.use(initReactI18next);
        await i18n.init({
            lng: DEFAULT_LANGUAGE,
            fallbackLng: DEFAULT_LANGUAGE,
            ns: NAMESPACES,
            defaultNS: 'common',
            backend: { loadPath: false },
            interpolation: { escapeValue: false },
        });
        loadTranslations();
        return i18n;
    } catch (e) {
        console.error('Failed to initialize i18n:', e);
        throw e;
    }
};

export const i18nInstance = initI18n();
export default i18n;
