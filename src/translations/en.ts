import dates from './dates.yml';

import common from './en/common.yml';
import education from './en/education.yml';
import employmentsIndex from './en/employments.yml';
import introduction from './en/introduction.yml';
import languages from './en/languages.yml';
import licenses_certifications from './en/licenses_certifications.yml';
import presentations from './en/presentations.yml';
import profile from './en/profile.yml';
import collibra from './en/employments/collibra.yml';
import continuum from './en/employments/continuum.yml';
import docbyte from './en/employments/docbyte.yml';
import dsi from './en/employments/dsi.yml';
import erasmus from './en/employments/erasmus.yml';
import telnet from './en/employments/telnet.yml';
import unified_post from './en/employments/unified_post.yml';

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
    dates,
});
