import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

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

export default i18n;