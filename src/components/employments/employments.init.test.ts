import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { useEmployments } from './employments.init';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

type TFn = (key: string, opts?: { ns?: string }) => unknown;

function mockEmployments(list: unknown, datesMap: Record<string, string> = {}) {
    const t: TFn = (key, opts) => {
        if (key === 'employments:list') return list;
        if (opts?.ns === 'dates') return key in datesMap ? datesMap[key] : key;
        return key;
    };
    vi.mocked(useTranslation).mockReturnValue({ t: vi.fn(t) } as unknown as ReturnType<typeof useTranslation>);
}

describe('useEmployments', () => {
    it('returns an empty array when the translated list is not an array', () => {
        mockEmployments('not-a-list');
        const { result } = renderHook(() => useEmployments());
        expect(result.current).toEqual([]);
    });

    it('defaults a missing type to an empty string and a non-array positions to []', () => {
        mockEmployments([{ company: 'Acme', icon: '/icon.png', positions: 'not-an-array' }]);
        const { result } = renderHook(() => useEmployments());
        expect(result.current).toEqual([{ company: 'Acme', icon: '/icon.png', type: '', positions: [] }]);
    });

    it('resolves a real (non-placeholder) start/end date string', () => {
        mockEmployments([
            {
                company: 'Acme',
                icon: '/icon.png',
                type: 'Full-time',
                positions: [
                    {
                        position: 'Engineer',
                        place: 'Remote',
                        description: 'desc',
                        period: { start: '2020-01-15', end: '2021-06-20' },
                    },
                ],
            },
        ]);

        const { result } = renderHook(() => useEmployments());
        const [position] = result.current[0]!.positions;

        expect(position!.period.start).toEqual(new Date(Date.UTC(2020, 0, 15)));
        expect(position!.period.end).toEqual(new Date(Date.UTC(2021, 5, 20)));
    });

    it('resolves a {{dates:key}} placeholder through the dates namespace', () => {
        mockEmployments(
            [
                {
                    company: 'Acme',
                    icon: '/icon.png',
                    positions: [
                        {
                            position: 'Engineer',
                            place: 'Remote',
                            description: 'desc',
                            period: { start: '{{dates:acme_start}}' },
                        },
                    ],
                },
            ],
            { acme_start: '2019-03-01' },
        );

        const { result } = renderHook(() => useEmployments());

        expect(result.current[0]!.positions[0]!.period.start).toEqual(new Date(Date.UTC(2019, 2, 1)));
    });

    it("falls back to today's date when the start/end resolves to an unresolved placeholder", () => {
        mockEmployments([
            {
                company: 'Acme',
                icon: '/icon.png',
                positions: [
                    {
                        position: 'Engineer',
                        place: 'Remote',
                        description: 'desc',
                        period: { start: '{{dates:missing}}' },
                    },
                ],
            },
        ]);
        // No entry for "missing" in the dates map, so the mock's `t` echoes the key back — the
        // same "unresolved placeholder" signal resolveDate() itself treats as a non-match.

        const { result } = renderHook(() => useEmployments());
        const { start, end } = result.current[0]!.positions[0]!.period;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        expect(start).toEqual(today);
        expect(end).toEqual(today);
    });

    it("falls back to today's date when the start/end is missing entirely", () => {
        mockEmployments([
            {
                company: 'Acme',
                icon: '/icon.png',
                positions: [{ position: 'Engineer', place: 'Remote', description: 'desc', period: {} }],
            },
        ]);

        const { result } = renderHook(() => useEmployments());
        const { start, end } = result.current[0]!.positions[0]!.period;

        // Matches common/utils.tsx's currentDate(): local-midnight, not UTC-midnight.
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        expect(start).toEqual(today);
        expect(end).toEqual(today);
    });
});
