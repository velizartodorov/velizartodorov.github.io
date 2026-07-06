import dates from './dates.json';

import enCommon from './en/common.json';
import enEducation from './en/education.json';
import enEmploymentsIndex from './en/employments.json';
import enIntroduction from './en/introduction.json';
import enLanguages from './en/languages.json';
import enLicensesCertifications from './en/licenses_certifications.json';
import enPresentations from './en/presentations.json';
import enProfile from './en/profile.json';
import enCollibra from './en/employments/collibra.json';
import enContinuum from './en/employments/continuum.json';
import enDocbyte from './en/employments/docbyte.json';
import enDsi from './en/employments/dsi.json';
import enErasmus from './en/employments/erasmus.json';
import enTelnet from './en/employments/telnet.json';
import enUnifiedPost from './en/employments/unified_post.json';

import nlCommon from './nl/common.json';
import nlEducation from './nl/education.json';
import nlEmploymentsIndex from './nl/employments.json';
import nlIntroduction from './nl/introduction.json';
import nlLanguages from './nl/languages.json';
import nlLicensesCertifications from './nl/licenses_certifications.json';
import nlPresentations from './nl/presentations.json';
import nlProfile from './nl/profile.json';
import nlCollibra from './nl/employments/collibra.json';
import nlContinuum from './nl/employments/continuum.json';
import nlDocbyte from './nl/employments/docbyte.json';
import nlDsi from './nl/employments/dsi.json';
import nlErasmus from './nl/employments/erasmus.json';
import nlTelnet from './nl/employments/telnet.json';
import nlUnifiedPost from './nl/employments/unified_post.json';

interface EmploymentsIndex {
    title: string;
    list: string[];
}

function buildEmployments(index: EmploymentsIndex, items: Record<string, unknown>) {
    return {
        title: index.title,
        list: index.list.map((fileName) => items[fileName]).filter(Boolean),
    };
}

const enEmploymentItems: Record<string, unknown> = {
    'collibra.json': enCollibra,
    'continuum.json': enContinuum,
    'docbyte.json': enDocbyte,
    'dsi.json': enDsi,
    'erasmus.json': enErasmus,
    'telnet.json': enTelnet,
    'unified_post.json': enUnifiedPost,
};

const nlEmploymentItems: Record<string, unknown> = {
    'collibra.json': nlCollibra,
    'continuum.json': nlContinuum,
    'docbyte.json': nlDocbyte,
    'dsi.json': nlDsi,
    'erasmus.json': nlErasmus,
    'telnet.json': nlTelnet,
    'unified_post.json': nlUnifiedPost,
};

export const resources = {
    en: {
        common: enCommon,
        education: enEducation,
        employments: buildEmployments(enEmploymentsIndex, enEmploymentItems),
        introduction: enIntroduction,
        languages: enLanguages,
        licenses_certifications: enLicensesCertifications,
        presentations: enPresentations,
        profile: enProfile,
        dates,
    },
    nl: {
        common: nlCommon,
        education: nlEducation,
        employments: buildEmployments(nlEmploymentsIndex, nlEmploymentItems),
        introduction: nlIntroduction,
        languages: nlLanguages,
        licenses_certifications: nlLicensesCertifications,
        presentations: nlPresentations,
        profile: nlProfile,
    },
};
