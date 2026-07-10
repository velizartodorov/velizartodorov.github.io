import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { useDisplayPeriod } from './utils';

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
const PERIOD_LANG = { present: 'Present' };

function mockTranslation() {
    const t = vi.fn((key: string) => (key === 'common:months' ? MONTHS : PERIOD_LANG));
    vi.mocked(useTranslation).mockReturnValue({ t } as unknown as ReturnType<typeof useTranslation>);
}

describe('useDisplayPeriod (education)', () => {
    it('shows "start - Present" for an ongoing (no end date) period', () => {
        mockTranslation();
        const { result } = renderHook(() => useDisplayPeriod());
        expect(result.current.display({ start: new Date('2022-01-01') })).toBe('January 2022 - Present');
    });

    it('shows "start - Present" when the end date falls in the current month', () => {
        mockTranslation();
        const { result } = renderHook(() => useDisplayPeriod());

        const now = new Date();
        const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        expect(result.current.display({ start, end: now })).toBe(
            `${MONTHS[start.getMonth()]} ${start.getFullYear()} - Present`,
        );
    });

    it('shows "start - end" for a closed period in a past month', () => {
        mockTranslation();
        const { result } = renderHook(() => useDisplayPeriod());
        expect(result.current.display({ start: new Date('2018-09-01'), end: new Date('2020-07-01') })).toBe(
            'September 2018 - July 2020',
        );
    });
});
