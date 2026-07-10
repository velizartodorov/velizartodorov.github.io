import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { useEmployments } from '../employments/employments.init';
import { useFormatBody, useIntroductionStats } from './utils';
import { Employment } from '../employments/employment';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));
vi.mock('../employments/employments.init', () => ({ useEmployments: vi.fn() }));

function mockT() {
    // Echoes back "common:period.and" -> "and", and "common:period.<x>" -> "<x>" so the singular
    // vs. plural key selected by the source is directly visible in the assertions below.
    const t = vi.fn((key: string) => key.split('.').pop());
    vi.mocked(useTranslation).mockReturnValue({ t } as unknown as ReturnType<typeof useTranslation>);
}

function employment(company: string, ...positions: Array<{ start: string; end?: string }>): Employment {
    return {
        company,
        icon: '',
        type: '',
        positions: positions.map((p) => ({
            position: 'role',
            place: 'place',
            description: '',
            period: { start: new Date(p.start), end: p.end ? new Date(p.end) : undefined },
        })),
    };
}

function mockEmployments(employments: Employment[]) {
    vi.mocked(useEmployments).mockReturnValue(employments);
}

describe('useIntroductionStats', () => {
    it('excludes the Telnet company and any position without an end date from the total', () => {
        mockT();
        mockEmployments([
            employment('Telnet Solutions', { start: '2015-01-01', end: '2020-01-01' }),
            employment('Acme', { start: '2021-01-01' }), // no end: still ongoing, excluded
        ]);

        const { result } = renderHook(() => useIntroductionStats());

        expect(result.current.totalYears).toBe(0);
        expect(result.current.softwareEmployments).toEqual([]);
    });

    it('borrows a month for a negative day difference, across a leap-year February', () => {
        mockT();
        mockEmployments([employment('Acme', { start: '2020-01-20', end: '2020-03-05' })]);

        const { result } = renderHook(() => useIntroductionStats());

        // Jan 20 -> Mar 5: naive months=2, days=5-20=-15 (borrow) -> months=1, +29 (Feb 2020 has 29
        // days in a leap year) -> days=14.
        expect(result.current.totalTime).toBe('0 years, 1 month, and 14 days');
    });

    it('borrows a year for a negative month difference', () => {
        mockT();
        mockEmployments([employment('Acme', { start: '2020-03-01', end: '2021-01-15' })]);

        const { result } = renderHook(() => useIntroductionStats());

        // years=1, months=0-2=-2 (borrow) -> years=0, months=10; days=15-1=14.
        expect(result.current.totalTime).toBe('0 years, 10 months, and 14 days');
    });

    it('rolls summed days >= 30 over into months', () => {
        mockT();
        mockEmployments([
            employment('Acme', { start: '2015-01-01', end: '2015-01-20' }), // 19 days
            employment('Other Co', { start: '2016-05-01', end: '2016-05-20' }), // 19 days
        ]);

        const { result } = renderHook(() => useIntroductionStats());

        // 19 + 19 = 38 days -> 1 month, 8 days.
        expect(result.current.totalTime).toBe('0 years, 1 month, and 8 days');
    });

    it('rolls summed months >= 12 over into years', () => {
        mockT();
        mockEmployments([
            employment('Acme', { start: '2010-01-01', end: '2010-08-01' }), // 7 months
            employment('Other Co', { start: '2012-01-01', end: '2012-08-01' }), // 7 months
        ]);

        const { result } = renderHook(() => useIntroductionStats());

        // 7 + 7 = 14 months -> 1 year, 2 months.
        expect(result.current.totalTime).toBe('1 year, 2 months, and 0 days');
    });

    it('uses the singular "day" label for a 1-day total', () => {
        mockT();
        mockEmployments([employment('Acme', { start: '2020-01-01', end: '2020-01-02' })]);

        const { result } = renderHook(() => useIntroductionStats());

        expect(result.current.totalTime).toBe('0 years, 0 months, and 1 day');
    });

    it('merges overlapping periods from different companies instead of double-counting them', () => {
        mockT();
        mockEmployments([
            employment('Acme', { start: '2019-01-01', end: '2019-07-01' }),
            employment('Other Co', { start: '2019-04-01', end: '2019-10-01' }), // overlaps Acme's
        ]);

        const { result } = renderHook(() => useIntroductionStats());

        // Merged: 2019-01-01 - 2019-10-01 = 9 months (not 6 + 6 = 12).
        expect(result.current.totalTime).toBe('0 years, 9 months, and 0 days');
    });
});

describe('useFormatBody', () => {
    it('joins an array body with spaces before interpolating', () => {
        mockT();
        mockEmployments([]);
        const { result } = renderHook(() => useFormatBody(['Hello', '{totalYears} years.']));
        expect(result.current).toBe('Hello 0 years.');
    });

    it('stringifies a non-array body before interpolating', () => {
        mockT();
        mockEmployments([]);
        const { result } = renderHook(() => useFormatBody('Experience: {totalTime}'));
        expect(result.current).toBe('Experience: 0 years, 0 months, and 0 days');
    });

    it('leaves an unknown placeholder untouched', () => {
        mockT();
        mockEmployments([]);
        const { result } = renderHook(() => useFormatBody('{unknownVar} stays literal'));
        expect(result.current).toBe('{unknownVar} stays literal');
    });
});
