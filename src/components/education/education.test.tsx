import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Education from './education';
import { AccordionProvider } from '../common/accordion_provider';
import { MONTHS, PERIOD_LANG } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { educationEntry } from '../../test-utils/education-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation(list: unknown) {
    mockUseTranslation((key: string) => {
        if (key === 'education:list') return list;
        if (key === 'education:title') return 'Education';
        if (key === 'common:months') return MONTHS;
        if (key === 'common:period') return PERIOD_LANG;
        if (key === 'common:period.at') return 'at';
        return key;
    });
}

// Education renders its own Timeline internally but, like the real page, relies on an ancestor
// AccordionProvider (mounted once in App.tsx) for TimelineEntry's useTimelineNode - so this test
// file has to supply one itself, same as renderInTimeline/renderInTimelineEntry do for the
// item-level tests.
function renderEducation() {
    return render(
        <AccordionProvider>
            <Education />
        </AccordionProvider>,
    );
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
        // to "January 1970 - January 1970" — the concrete symptom this regression test guards.
        expect(screen.getByText('January 1970 - January 1970')).toBeInTheDocument();
    });

    it('renders an entry with a real period', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        mockTranslation([educationEntry()]);

        renderEducation();

        expect(screen.getByText(/Engineering/)).toBeInTheDocument();
        expect(screen.getByText('September 2018 - July 2020')).toBeInTheDocument();
    });
});
