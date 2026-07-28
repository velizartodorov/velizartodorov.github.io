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
