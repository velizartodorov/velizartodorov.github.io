import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEmploymentStats } from '../employments/employment_stats';
import { useFormatBody } from './utils';

vi.mock('../employments/employment_stats', () => ({ useEmploymentStats: vi.fn() }));

function mockStats(totalYears: number, totalTime: string) {
    vi.mocked(useEmploymentStats).mockReturnValue({ softwareEmployments: [], totalYears, totalTime });
}

describe('useFormatBody', () => {
    it.each([
        {
            name: 'joins an array body with spaces before interpolating',
            body: ['Hello', '{totalYears} years.'],
            expected: 'Hello 0 years.',
        },
        {
            name: 'stringifies a non-array body before interpolating',
            body: 'Experience: {totalTime}',
            expected: 'Experience: 0 years, 0 months, and 0 days',
        },
        {
            name: 'leaves an unknown placeholder untouched',
            body: '{unknownVar} stays literal',
            expected: '{unknownVar} stays literal',
        },
    ])('$name', ({ body, expected }) => {
        mockStats(0, '0 years, 0 months, and 0 days');

        const { result } = renderHook(() => useFormatBody(body));

        expect(result.current).toBe(expected);
    });
});
