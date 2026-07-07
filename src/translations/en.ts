import dates from './dates.yml';

import common from './en/common.yml';
import educationIndex from './en/education.yml';
import employmentsIndex from './en/employments.yml';
import introduction from './en/introduction.yml';
import languages from './en/languages.yml';
import licenses_certifications from './en/licenses_certifications.yml';
import presentations from './en/presentations.yml';
import profile from './en/profile.yml';
import collibra from './en/employments/collibra.md';
import continuum from './en/employments/continuum.md';
import docbyte from './en/employments/docbyte.md';
import dsi from './en/employments/dsi.md';
import erasmus from './en/employments/erasmus.md';
import telnet from './en/employments/telnet.md';
import unified_post from './en/employments/unified_post.md';
import dutch_second_language from './en/education/dutch_second_language.md';
import software_engineering from './en/education/software_engineering.md';
import computer_engineering from './en/education/computer_engineering.md';
import german_english from './en/education/german_english.md';

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
    dates,
});
