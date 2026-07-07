import dates from './dates.json';

import common from './en/common.json';
import education from './en/education.json';
import employmentsIndex from './en/employments.json';
import introduction from './en/introduction.json';
import languages from './en/languages.json';
import licenses_certifications from './en/licenses_certifications.json';
import presentations from './en/presentations.json';
import profile from './en/profile.json';
import collibra from './en/employments/collibra.json';
import continuum from './en/employments/continuum.json';
import docbyte from './en/employments/docbyte.json';
import dsi from './en/employments/dsi.json';
import erasmus from './en/employments/erasmus.json';
import telnet from './en/employments/telnet.json';
import unified_post from './en/employments/unified_post.json';

import { buildLanguageResources } from './build-resources';

export const resources = buildLanguageResources({
    common,
    education,
    employmentsIndex,
    employmentItems: {
        'collibra.json': collibra,
        'continuum.json': continuum,
        'docbyte.json': docbyte,
        'dsi.json': dsi,
        'erasmus.json': erasmus,
        'telnet.json': telnet,
        'unified_post.json': unified_post,
    },
    introduction,
    languages,
    licenses_certifications,
    presentations,
    profile,
    dates,
});
