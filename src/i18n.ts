
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Types & Constants
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

// Helpers
const getTranslationPath = (language: string, namespace: string | string[]): string => {
  const ns = Array.isArray(namespace) ? namespace[0] : namespace;
  return ns === 'dates' ? '/translations/dates.json' : `/translations/${language}/${ns}.json`;
};

const loadEmployments = (lang: Language): void => {
  const { title, list = [] } = require(`../public/translations/${lang}/employments.json`) as { title: string; list: string[] };
  const employments = list.map((file: string) =>
    require(`../public/translations/${lang}/employments/${file}`)
  );

  i18n.addResourceBundle(lang, 'employments', { title, list: employments }, true, true);
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    backend: { loadPath: getTranslationPath },
  });

SUPPORTED_LANGUAGES.forEach(loadEmployments);

export default i18n;