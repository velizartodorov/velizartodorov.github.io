import dates from './dates.yml';

import common from './nl/common.yml';
import education from './nl/education.yml';
import employmentsIndex from './nl/employments.yml';
import introduction from './nl/introduction.yml';
import languages from './nl/languages.yml';
import licenses_certifications from './nl/licenses_certifications.yml';
import presentations from './nl/presentations.yml';
import profile from './nl/profile.yml';
import collibra from './nl/employments/collibra.yml';
import continuum from './nl/employments/continuum.yml';
import docbyte from './nl/employments/docbyte.yml';
import dsi from './nl/employments/dsi.yml';
import erasmus from './nl/employments/erasmus.yml';
import telnet from './nl/employments/telnet.yml';
import unified_post from './nl/employments/unified_post.yml';

import { buildLanguageResources } from './build-resources';

export const resources = buildLanguageResources({
    common,
    education,
    employmentsIndex,
    employmentItems: {
        'collibra.yml': collibra,
        'continuum.yml': continuum,
        'docbyte.yml': docbyte,
        'dsi.yml': dsi,
        'erasmus.yml': erasmus,
        'telnet.yml': telnet,
        'unified_post.yml': unified_post,
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
