import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDisplayPeriod } from './utils';
import { MONTHS, PERIOD_LANG } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { period } from '../../test-utils/period-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation() {
    mockUseTranslation((key: string) => (key === 'common:months' ? MONTHS : PERIOD_LANG));
}

describe('useDisplayPeriod (education)', () => {
    it('shows "start - Present" for an ongoing (no end date) period', () => {
        mockTranslation();
        const { result } = renderHook(() => useDisplayPeriod());
        expect(result.current.display(period('2022-01-01'))).toBe('January 2022 - Present');
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
        expect(result.current.display(period('2018-09-01', '2020-07-01'))).toBe('September 2018 - July 2020');
    });
});
