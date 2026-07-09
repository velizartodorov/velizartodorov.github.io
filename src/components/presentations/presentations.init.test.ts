import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { usePresentations } from './presentations.init';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation(t: unknown, ready: boolean) {
    vi.mocked(useTranslation).mockReturnValue({ t, ready } as unknown as ReturnType<typeof useTranslation>);
}

describe('usePresentations', () => {
    it('returns an empty array when translations are not ready', () => {
        mockTranslation(vi.fn(), false);
        const { result } = renderHook(() => usePresentations());
        expect(result.current).toEqual([]);
    });

    it('returns an empty array when the translated list is not an array', () => {
        mockTranslation(
            vi.fn(() => 'not-a-list'),
            true,
        );
        const { result } = renderHook(() => usePresentations());
        expect(result.current).toEqual([]);
    });

    it('maps each presentation to name, icon and link', () => {
        const list = [
            { name: 'Git workflows', icon: '/icons/git.png', link: 'https://example.com/git' },
            { name: 'CI/CD deep dive', icon: '/icons/ci.png', link: 'https://example.com/ci' },
        ];
        mockTranslation(
            vi.fn(() => list),
            true,
        );

        const { result } = renderHook(() => usePresentations());

        expect(result.current).toEqual(list);
    });
});
