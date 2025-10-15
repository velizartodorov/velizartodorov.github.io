import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

type Language = 'en' | 'nl';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'nl'];
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

interface TranslationModule { default: Record<string, any>; }

const loadAllTranslations = async () => {
  const translationModules = import.meta.glob<TranslationModule>([
    './translations/**/*.json',
    '!./translations/**/employments/**/*.json',
    './translations/dates.json',
  ]);

  for (const [path, importModule] of Object.entries(translationModules)) {
    try {
      const module = await importModule();
      const matches = path.match(/\/translations\/(?:([^/]+)\/)?([^/]+)\.json$/);
      if (!matches || !matches[2]) continue;

      const [, lang = DEFAULT_LANGUAGE, fileName] = matches;

      if (fileName === 'dates') {
        i18n.addResourceBundle(DEFAULT_LANGUAGE, 'dates', module.default, true, true);
        continue;
      }
      if (fileName === 'employments') continue;

      const namespace = fileName.replace('.json', '');
      i18n.addResourceBundle(lang as Language, namespace, module.default, true, true);
    } catch (error) {
      console.error(`Error loading translation file ${path}:`, error);
    }
  }
};

interface EmploymentIndex { title: string; list: string[]; }
interface EmploymentData { index?: EmploymentIndex; items?: Record<string, any>[]; }

const loadEmployments = async () => {
  const indexModules = import.meta.glob<TranslationModule>('./translations/*/employments.json');
  const itemModules = import.meta.glob<TranslationModule>('./translations/*/employments/*.json');

  const employmentsByLang: Record<string, EmploymentData> = {};
  for (const [path, importModule] of Object.entries(indexModules)) {
    try {
      const module = await importModule();
      const langMatch = path.match(/\.\/translations\/([^/]+)\/employments\.json/);
      if (!langMatch || !langMatch[1]) continue;
      const lang = langMatch[1];
      const indexData = module.default as EmploymentIndex;
      if (SUPPORTED_LANGUAGES.includes(lang as Language)) {
        employmentsByLang[lang] = { index: indexData, items: [] };
      }
    } catch (error) {
      console.error(`Error loading employment index file ${path}:`, error);
    }
  }

  const employmentFilesByLang: Record<string, Record<string, Record<string, any>>> = {};
  for (const [path, importModule] of Object.entries(itemModules)) {
    try {
      const module = await importModule();
      const langMatch = path.match(/\.\/translations\/([^/]+)\/employments\//);
      if (!langMatch || !langMatch[1]) continue;
      const lang = langMatch[1];
      const fileName = path.split('/').pop() || '';
      (employmentFilesByLang[lang] ||= {})[fileName] = module.default;
    } catch (error) {
      console.error(`Error loading employment file ${path}:`, error);
    }
  }

  Object.entries(employmentsByLang).forEach(([lang, data]) => {
    if (data.index && employmentFilesByLang[lang]) {
      const langFiles = employmentFilesByLang[lang];
      const orderedItems = data.index.list.map(fileName => langFiles[fileName]).filter(Boolean);
      i18n.addResourceBundle(lang as Language, 'employments', { title: data.index.title, list: orderedItems }, true, true);
    }
  });
};

const loadTranslations = async () => {
  await Promise.all([loadAllTranslations(), loadEmployments()]);
};

const initI18n = async () => {
  try {
    i18n
      .use(Backend)           // optional if you rely solely on addResourceBundle
      .use(initReactI18next);

    await i18n.init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      ns: NAMESPACES,
      defaultNS: 'common',
      interpolation: { escapeValue: false },
    });

    await loadTranslations(); // load once
    return i18n;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    throw error;
  }
};

export const i18nInstance = initI18n();
export default i18n;