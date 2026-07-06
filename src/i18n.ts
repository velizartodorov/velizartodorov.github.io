import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './translations';

export type Language = 'en' | 'nl';
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

i18n.use(initReactI18next).init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    ns: NAMESPACES,
    defaultNS: 'common',
    resources,
    interpolation: { escapeValue: false },
});

export function createLangInstance(lang: Language) {
    return i18n.cloneInstance({ lng: lang });
}

export default i18n;
