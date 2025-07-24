import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './components/common/common.en.json';
import nlCommon from './components/common/common.nl.json';
import enEmployments from './components/employments/employments.en.json';
import nlEmployments from './components/employments/employments.nl.json';
import enEducation from './components/education/education/education.en.json';
import nlEducation from './components/education/education/education.nl.json';
import enLicenses from './components/licenses_certifications/licenses_certifications.en.json';
import nlLicenses from './components/licenses_certifications/licenses_certifications.nl.json';
import enProfile from './components/header/profile.en.json';
import nlProfile from './components/header/profile.nl.json';
import enIntroduction from './components/introduction/introduction.en.json';
import nlIntroduction from './components/introduction/introduction.nl.json';

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
