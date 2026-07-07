import dates from './dates.json';

import common from './nl/common.json';
import education from './nl/education.json';
import employmentsIndex from './nl/employments.json';
import introduction from './nl/introduction.json';
import languages from './nl/languages.json';
import licenses_certifications from './nl/licenses_certifications.json';
import presentations from './nl/presentations.json';
import profile from './nl/profile.json';
import collibra from './nl/employments/collibra.json';
import continuum from './nl/employments/continuum.json';
import docbyte from './nl/employments/docbyte.json';
import dsi from './nl/employments/dsi.json';
import erasmus from './nl/employments/erasmus.json';
import telnet from './nl/employments/telnet.json';
import unified_post from './nl/employments/unified_post.json';

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
    // Dates are locale-agnostic data (not translated copy), so both language bundles carry the
    // same values — each page/instance is self-sufficient without needing the other language's
    // module loaded as a fallback.
    dates,
});
