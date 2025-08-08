
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

function loadAndRegisterEmploymentsSync(lang: string) {
  const employmentsData = require(`../public/translations/${lang}/employments.json`);
  const files: string[] = Array.isArray(employmentsData.list) ? employmentsData.list : [];
  const all = files.map((file) => {
    return require(`../public/translations/${lang}/employments/${file}`);
  });
  i18n.addResourceBundle(lang, 'employments', { title: employmentsData.title, list: all }, true, true);
}

const NAMESPACES = [
  'common',
  'employments',
  'education',
  'licenses_certifications',
  'profile',
  'introduction',
  'dates',
];

function customLoadPath(lngs: string, namespaces: string | string[]): string {
  if (
    namespaces === 'dates' ||
    (Array.isArray(namespaces) && namespaces.includes('dates')) ||
    (typeof namespaces === 'string' && namespaces.endsWith('dates'))
  ) {
    return '/translations/dates.json';
  }
  return `/translations/${lngs}/${Array.isArray(namespaces) ? namespaces[0] : namespaces}.json`;
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: customLoadPath,
    },
  });

const langs = ['en', 'nl'];
for (const lang of langs) {
  loadAndRegisterEmploymentsSync(lang);
}

export default i18n;