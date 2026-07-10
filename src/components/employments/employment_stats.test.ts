import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEmployments } from './employments.init';
import { useEmploymentStats } from './employment_stats';
import { Employment } from './employment';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { employment as buildEmployment, position } from '../../test-utils/employment-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));
vi.mock('./employments.init', () => ({ useEmployments: vi.fn() }));

function mockT() {
    // Echoes back "common:period.and" -> "and", and "common:period.<x>" -> "<x>" so the singular
    // vs. plural key selected by the source is directly visible in the assertions below.
    mockUseTranslation((key: string) => key.split('.').pop());
}

// Thin wrapper over the shared employment fixture, preserving this file's existing call-site
// shape (`employment('Acme', { start, end })`) since only the period timing matters to these
// duration calculations, not any position's actual title/place/description.
function employment(company: string, ...periods: Array<{ start: string; end?: string }>): Employment {
    return buildEmployment({ company, positions: periods.map((p) => position(p)) });
}

function mockEmployments(employments: Employment[]) {
    vi.mocked(useEmployments).mockReturnValue(employments);
}

describe('useEmploymentStats', () => {
    it('excludes the Telnet company and any position without an end date from the total', () => {
        mockT();
        mockEmployments([
            employment('Telnet Solutions', { start: '2015-01-01', end: '2020-01-01' }),
            employment('Acme', { start: '2021-01-01' }), // no end: still ongoing, excluded
        ]);

        const { result } = renderHook(() => useEmploymentStats());

        expect(result.current.totalYears).toBe(0);
        expect(result.current.softwareEmployments).toEqual([]);
    });

    it.each([
        {
            name: 'borrows a month for a negative day difference, across a leap-year February',
            employments: [employment('Acme', { start: '2020-01-20', end: '2020-03-05' })],
            // Jan 20 -> Mar 5: naive months=2, days=5-20=-15 (borrow) -> months=1, +29 (Feb 2020 has
            // 29 days in a leap year) -> days=14.
            expected: '0 years, 1 month, and 14 days',
        },
        {
            name: 'borrows a year for a negative month difference',
            employments: [employment('Acme', { start: '2020-03-01', end: '2021-01-15' })],
            // years=1, months=0-2=-2 (borrow) -> years=0, months=10; days=15-1=14.
            expected: '0 years, 10 months, and 14 days',
        },
        {
            name: 'uses the singular "day" label for a 1-day total',
            employments: [employment('Acme', { start: '2020-01-01', end: '2020-01-02' })],
            expected: '0 years, 0 months, and 1 day',
        },
        {
            name: 'rolls summed days >= 30 over into months',
            employments: [
                employment('Acme', { start: '2015-01-01', end: '2015-01-20' }), // 19 days
                employment('Other Co', { start: '2016-05-01', end: '2016-05-20' }), // 19 days
            ],
            // 19 + 19 = 38 days -> 1 month, 8 days.
            expected: '0 years, 1 month, and 8 days',
        },
        {
            name: 'rolls summed months >= 12 over into years',
            employments: [
                employment('Acme', { start: '2010-01-01', end: '2010-08-01' }), // 7 months
                employment('Other Co', { start: '2012-01-01', end: '2012-08-01' }), // 7 months
            ],
            // 7 + 7 = 14 months -> 1 year, 2 months.
            expected: '1 year, 2 months, and 0 days',
        },
        {
            name: 'merges overlapping periods from different companies instead of double-counting them',
            employments: [
                employment('Acme', { start: '2019-01-01', end: '2019-07-01' }),
                employment('Other Co', { start: '2019-04-01', end: '2019-10-01' }), // overlaps Acme's
            ],
            // Merged: 2019-01-01 - 2019-10-01 = 9 months (not 6 + 6 = 12).
            expected: '0 years, 9 months, and 0 days',
        },
    ])('$name', ({ employments, expected }) => {
        mockT();
        mockEmployments(employments);

        const { result } = renderHook(() => useEmploymentStats());

        expect(result.current.totalTime).toBe(expected);
    });
});
