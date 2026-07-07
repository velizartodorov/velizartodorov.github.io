import dates from './dates.yml';

import common from './nl/common.yml';
import educationIndex from './nl/education.yml';
import employmentsIndex from './nl/employments.yml';
import introduction from './nl/introduction.yml';
import languages from './nl/languages.yml';
import licenses_certifications from './nl/licenses_certifications.yml';
import presentations from './nl/presentations.yml';
import profile from './nl/profile.yml';
import collibra from './nl/employments/collibra.md';
import continuum from './nl/employments/continuum.md';
import docbyte from './nl/employments/docbyte.md';
import dsi from './nl/employments/dsi.md';
import erasmus from './nl/employments/erasmus.md';
import telnet from './nl/employments/telnet.md';
import unified_post from './nl/employments/unified_post.md';
import dutch_second_language from './nl/education/dutch_second_language.md';
import software_engineering from './nl/education/software_engineering.md';
import computer_engineering from './nl/education/computer_engineering.md';
import german_english from './nl/education/german_english.md';

import { buildLanguageResources } from './build-resources';

export const resources = buildLanguageResources({
    common,
    educationIndex,
    educationItems: {
        'dutch_second_language.md': dutch_second_language,
        'software_engineering.md': software_engineering,
        'computer_engineering.md': computer_engineering,
        'german_english.md': german_english,
    },
    employmentsIndex,
    employmentItems: {
        'collibra.md': collibra,
        'continuum.md': continuum,
        'docbyte.md': docbyte,
        'dsi.md': dsi,
        'erasmus.md': erasmus,
        'telnet.md': telnet,
        'unified_post.md': unified_post,
    },
    introduction,
    languages,
    licenses_certifications,
    presentations,
    profile,
    // Dates are locale-agnostic data (not translated copy), so both language bundles carry the
    // same values — each page/instance is self-sufficient without needing the other language's
    // module loaded as a fallback.
    dates,
});
