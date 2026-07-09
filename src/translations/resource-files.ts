// Single source of truth for which employment/education markdown files exist. Both en.ts and
// nl.ts must provide exactly these keys in their employmentItems/educationItems maps - see
// build-resources.ts, which types those maps against EmploymentFile/EducationFile so a missing
// or misspelled key in either language fails to compile instead of silently dropping content.
export const EMPLOYMENT_FILES = [
    'collibra.md',
    'continuum.md',
    'docbyte.md',
    'dsi.md',
    'erasmus.md',
    'telnet.md',
    'unified_post.md',
] as const;
export type EmploymentFile = (typeof EMPLOYMENT_FILES)[number];

export const EDUCATION_FILES = [
    'dutch_second_language.md',
    'software_engineering.md',
    'computer_engineering.md',
    'german_english.md',
] as const;
export type EducationFile = (typeof EDUCATION_FILES)[number];
