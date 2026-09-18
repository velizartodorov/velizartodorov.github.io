import { describe, expect, it, vi } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import Education from './education';
import { useDisplayPeriod } from './utils';
import { loadAllStrings } from '../../app/translations/resources';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { educationEntry } from '../../test-utils/education-fixtures';
import { period } from '../../test-utils/period-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

const strings = await loadAllStrings();

function mockTranslation(list: unknown) {
    mockUseTranslation((key: string) => (key === 'education:list' ? list : strings('en', key)));
}

function displayPeriod(p: ReturnType<typeof period>): string {
    return renderHook(() => useDisplayPeriod()).result.current.display(p);
}

function renderEducation() {
    return render(<Education />);
}

describe('Education', () => {
    it('renders no items when the translated list is not an array', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        mockTranslation('not-a-list');
        renderEducation();
        // Section has no toggle button, and an empty Timeline has no entry markers either.
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('falls back to the Unix epoch when an entry has no period', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        mockTranslation([
            educationEntry({ occupation: 'Self-taught', institution: 'N/A', place: '', period: undefined }),
        ]);

        renderEducation();

        // A period at the Unix epoch (start === end) is squarely in the past, so display() resolves
        // to the epoch month repeated — the concrete symptom this regression test guards.
        expect(screen.getByText(displayPeriod(period('1970-01-01', '1970-01-01')))).toBeInTheDocument();
    });

    it('renders an entry with a real period', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        mockTranslation([educationEntry()]);

        renderEducation();

        expect(screen.getByText(/Engineering/)).toBeInTheDocument();
        expect(screen.getByText(displayPeriod(educationEntry().period))).toBeInTheDocument();
    });
});
