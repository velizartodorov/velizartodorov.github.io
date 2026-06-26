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

const logError = (ctx: string, path: string, err: unknown) =>
  console.error(`Error ${ctx} ${path}:`, err);

const TRANSLATION_PATH_RE = /\/translations\/(?:([^/]+)\/)?([^/]+)\.json$/;
const EMPLOYMENTS_INDEX_RE = /\.\/translations\/([^/]+)\/employments\.json/;
const EMPLOYMENTS_ITEM_LANG_RE = /\.\/translations\/([^/]+)\/employments\//;

async function importGlob<T>(
  mods: Record<string, () => Promise<T>>,
  onEach: (p: string, m: T) => void | Promise<void>,
  ctx: string
) {
  for (const [p, importer] of Object.entries(mods)) {
    try {
      const mod = await importer();
      await onEach(p, mod);
    } catch (e) {
      logError(ctx, p, e);
    }
  }
}

const loadAllTranslations = async () => {
  const mods = import.meta.glob([
    './translations/**/*.json',
    '!./translations/**/employments/**/*.json',
    './translations/dates.json',
  ]);

  await importGlob(
    mods,
    async (path, mod: any) => {
      const m = new RegExp(TRANSLATION_PATH_RE).exec(path);
      if (!m) return;
      const [, langMaybe, fileName] = m;
      if (!fileName) return;
      const lang: Language = isSupportedLang(langMaybe)
        ? langMaybe
        : DEFAULT_LANGUAGE;
      if (fileName === 'dates') {
        addBundle(DEFAULT_LANGUAGE, 'dates', mod.default);
        return;
      }
      if (fileName === 'employments') return;
      addBundle(lang, fileName.replace(/\.json$/, ''), mod.default);
    },
    'translation file'
  );
};

const loadEmployments = async () => {
  const indexMods = import.meta.glob('./translations/*/employments.json');
  const itemMods = import.meta.glob('./translations/*/employments/*.json');
  const byLang: Record<Language, any> = { en: {}, nl: {} };

  await importGlob(
    indexMods,
    async (p, m: any) => {
      const l = new RegExp(EMPLOYMENTS_INDEX_RE).exec(p)?.[1];
      if (!isSupportedLang(l)) return;
      byLang[l].index = m.default;
      byLang[l].items = [];
    },
    'employment index'
  );

  const filesByLang: Partial<Record<Language, Record<string, any>>> = {};
  await importGlob(
    itemMods,
    async (p, m: any) => {
      const l = new RegExp(EMPLOYMENTS_ITEM_LANG_RE).exec(p)?.[1];
      if (!isSupportedLang(l)) return;
      const f = p.split('/').pop() || '';
      (filesByLang[l] ||= {})[f] = m.default;
    },
    'employment file'
  );

  (Object.entries(byLang) as [Language, any][]).forEach(([lang, data]) => {
    const files = filesByLang[lang];
    if (!data.index || !files) return;
    const ordered = (data.index.list || [])
      .map((f: string) => files[f])
      .filter(Boolean);
    addBundle(lang, 'employments', {
      title: data.index.title,
      list: ordered,
    });
  });
};

const loadTranslations = async () => {
  await Promise.all([loadAllTranslations(), loadEmployments()]);
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
    await loadTranslations();
    return i18n;
  } catch (e) {
    console.error('Failed to initialize i18n:', e);
    throw e;
  }
};

export const i18nInstance = initI18n();
export default i18n;