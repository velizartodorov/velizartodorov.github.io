// Shared fixtures for tests that mock react-i18next's useTranslation() directly rather than
// rendering against real translation resources (see src/dates.test.tsx for that heavier approach).
export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

// Superset of every key a mocked 'common:period' object has needed across test files; extra keys
// are harmless since a given test only reads the ones its component actually uses.
export const PERIOD_LANG = {
    present: 'Present',
    at: 'at',
    year: 'year',
    years: 'years',
    month: 'month',
    months: 'months',
};
