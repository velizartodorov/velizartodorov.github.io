
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        ns: [
            'common',
            'employments',
            'education',
            'licenses_certifications',
            'profile',
            'introduction',
            'dates'
        ],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: (lngs: string, namespaces: string) => {
                if (namespaces === 'dates'
                    || (Array.isArray(namespaces)
                        && namespaces.includes('dates'))) {
                    return '/translations/dates.json';
                }
                return '/translations/' + lngs + '/' + namespaces + '.json';
            },
        },
    });

export default i18n;