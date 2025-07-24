import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './components/common//translations/common.en.json';
import nlCommon from './components/common/translations/common.nl.json';
import enEmployments from './components/employments/translations/employments.en.json';
import nlEmployments from './components/employments/translations/employments.nl.json';
import enEducation from './components/education/translations/education.en.json';
import nlEducation from './components/education/translations/education.nl.json';
import enLicenses from './components/licenses_certifications/translations/licenses_certifications.en.json';
import nlLicenses from './components/licenses_certifications/translations/licenses_certifications.nl.json';
import enProfile from './components/header/translations/profile.en.json';
import nlProfile from './components/header/translations/profile.nl.json';
import enIntroduction from './components/introduction/translations/introduction.en.json';
import nlIntroduction from './components/introduction/translations/introduction.nl.json';

const resources = {
    en: {
        common: enCommon,
        employments: enEmployments,
        education: enEducation,
        licenses: enLicenses,
        profile: enProfile,
        introduction: enIntroduction,
    },
    nl: {
        common: nlCommon,
        employments: nlEmployments,
        education: nlEducation,
        licenses: nlLicenses,
        profile: nlProfile,
        introduction: nlIntroduction,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        ns: ['common', 'employments', 'education', 'licenses', 'profile', 'introduction'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;