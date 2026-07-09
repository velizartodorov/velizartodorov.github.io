import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import Languages from './languages';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation(list: unknown, ready: boolean) {
    const t = vi.fn((key: string) => (key === 'list' ? list : key));
    vi.mocked(useTranslation).mockReturnValue({ t, ready } as unknown as ReturnType<typeof useTranslation>);
}

describe('Languages edge cases', () => {
    it('renders no language items when translations are not ready', () => {
        mockTranslation([{ label: 'English', icon: '', proficiency: 'Native' }], false);

        render(<Languages eventKey="4" />);

        expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('renders no language items when the translated list is not an array', () => {
        mockTranslation('not-a-list', true);

        render(<Languages eventKey="4" />);

        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
});
