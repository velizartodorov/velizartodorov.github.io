import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import Languages from './languages';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation(list: unknown, ready: boolean) {
    const t = vi.fn((key: string) => (key === 'list' ? list : key));
    vi.mocked(useTranslation).mockReturnValue({ t, ready } as unknown as ReturnType<typeof useTranslation>);
}

function renderLanguages() {
    return render(<Languages />);
}

describe('Languages edge cases', () => {
    it('renders no language items when translations are not ready', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        mockTranslation([{ label: 'English', icon: '', proficiency: 'Native' }], false);

        renderLanguages();

        expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('renders no language items when the translated list is not an array', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        mockTranslation('not-a-list', true);

        renderLanguages();

        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
});
