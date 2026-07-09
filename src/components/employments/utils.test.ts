import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { combinedPeriod, useDisplayPeriod } from './utils';
import { Period } from '../common/period';
import { Position } from './employment';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

const MONTHS = [
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

const PERIOD_LANG = {
    year: 'year',
    years: 'years',
    month: 'month',
    months: 'months',
    present: 'Present',
};

function mockTranslation() {
    const t = vi.fn((key: string) => {
        if (key === 'common:months') return MONTHS;
        if (key === 'common:period') return PERIOD_LANG;
        return key;
    });
    vi.mocked(useTranslation).mockReturnValue({ t } as unknown as ReturnType<typeof useTranslation>);
}

function position(start: string, end?: string): Position {
    return {
        position: 'p',
        place: 'place',
        description: 'desc',
        period: { start: new Date(start), end: end ? new Date(end) : undefined },
    };
}

describe('combinedPeriod', () => {
    it('returns undefined for an empty positions list', () => {
        expect(combinedPeriod([])).toBeUndefined();
    });

    it('spans the earliest start and latest end across positions', () => {
        const result = combinedPeriod([
            position('2020-01-01', '2020-06-01'),
            position('2019-01-01', '2021-01-01'),
            position('2020-03-01', '2020-09-01'),
        ]);
        expect(result).toEqual({ start: new Date('2019-01-01'), end: new Date('2021-01-01') });
    });

    it('is open-ended (undefined end) when any position has no end date', () => {
        const result = combinedPeriod([position('2020-01-01', '2020-06-01'), position('2021-01-01')]);
        expect(result!.end).toBeUndefined();
    });
});

describe('useDisplayPeriod', () => {
    function displayPeriod(period: Period) {
        mockTranslation();
        const { result } = renderHook(() => useDisplayPeriod());
        return result.current.display(period);
    }

    it('shows "start - Present" when the period has no end', () => {
        expect(displayPeriod({ start: new Date('2020-03-01') })).toBe('March 2020 - Present');
    });

    it('shows "start - Present" when the start date is in the future', () => {
        const future = new Date();
        future.setFullYear(future.getFullYear() + 5);
        expect(displayPeriod({ start: future, end: future })).toBe(
            `${MONTHS[future.getMonth()]} ${future.getFullYear()} - Present`,
        );
    });

    it('shows "start - Present (duration)" when the end date falls in the current month', () => {
        const now = new Date();
        const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        expect(displayPeriod({ start, end: now })).toBe(
            `${MONTHS[start.getMonth()]} ${start.getFullYear()} - Present (1 year)`,
        );
    });

    it('shows "start - end (duration)" for a past, closed period', () => {
        expect(displayPeriod({ start: new Date('2019-01-15'), end: new Date('2020-04-15') })).toBe(
            'January 2019 - April 2020 (1 year, 3 months)',
        );
    });

    it('omits the duration parentheses when start and end are the same month', () => {
        // periodDifference() returns '' here, leaving the trailing space from the template intact.
        expect(displayPeriod({ start: new Date('2020-01-01'), end: new Date('2020-01-28') })).toBe(
            'January 2020 - January 2020 ',
        );
    });
});
