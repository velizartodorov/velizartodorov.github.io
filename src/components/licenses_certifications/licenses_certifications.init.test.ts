import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLicensesCertifications, useMonthYear } from './licenses_certifications.init';
import { MONTHS } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation as mockTranslation } from '../../test-utils/mock-use-translation';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

describe('useMonthYear', () => {
    it('returns an empty string for a falsy date', () => {
        mockTranslation(() => MONTHS);
        const { result } = renderHook(() => useMonthYear());
        expect(result.current('')).toBe('');
    });

    it('formats a date string as "Month Year"', () => {
        mockTranslation(() => MONTHS);
        const { result } = renderHook(() => useMonthYear());
        expect(result.current('2025-02-10')).toBe('February 2025');
    });
});

describe('useLicensesCertifications', () => {
    it('returns an empty array when translations are not ready', () => {
        mockTranslation(() => 'irrelevant', false);
        const { result } = renderHook(() => useLicensesCertifications());
        expect(result.current).toEqual([]);
    });

    it('returns an empty array when the translated list is not an array', () => {
        mockTranslation((key) => (key === 'licenses_certifications:list' ? 'not-a-list' : key));
        const { result } = renderHook(() => useLicensesCertifications());
        expect(result.current).toEqual([]);
    });

    it('defaults missing institution/icon and a non-array certifications to empty values', () => {
        mockTranslation((key) => (key === 'licenses_certifications:list' ? [{ certifications: 'not-an-array' }] : key));
        const { result } = renderHook(() => useLicensesCertifications());
        expect(result.current).toEqual([{ institution: '', icon: '', certifications: [] }]);
    });

    it('maps certifications, defaulting missing name/field/link and resolving the date', () => {
        const list = [
            {
                institution: 'AWS',
                icon: '/aws.png',
                certifications: [{ date: '2025-02-01' }],
            },
        ];
        mockTranslation((key) => (key === 'licenses_certifications:list' ? list : key));

        const { result } = renderHook(() => useLicensesCertifications());

        expect(result.current).toEqual([
            {
                institution: 'AWS',
                icon: '/aws.png',
                certifications: [{ name: '', field: '', date: '2025-02-01', link: '' }],
            },
        ]);
    });
});
