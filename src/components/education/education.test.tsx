import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Education from './education';
import { MONTHS, PERIOD_LANG } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { period } from '../../test-utils/period-fixtures';

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

describe('Education', () => {
    it('renders no items when the translated list is not an array', () => {
        mockTranslation('not-a-list');
        render(<Education eventKey="5" />);
        // Exactly one button: the AccordionWrapper's own toggle header, with no education items
        // (each of which would add its own AccordionItem button) inside it.
        expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('falls back to the Unix epoch when an entry has no period', () => {
        mockTranslation([
            { occupation: 'Self-taught', institution: 'N/A', place: '', icon: '', body: '', period: undefined },
        ]);

        render(<Education eventKey="5" />);

        // A period at the Unix epoch (start === end) is squarely in the past, so display() resolves
        // to "January 1970 - January 1970" — the concrete symptom this regression test guards.
        expect(screen.getByText('January 1970 - January 1970')).toBeInTheDocument();
    });

    it('renders an entry with a real period', () => {
        mockTranslation([
            {
                occupation: 'Engineering',
                institution: 'Tech University',
                place: 'Remote',
                icon: '',
                body: '',
                period: period('2018-09-01', '2020-07-01'),
            },
        ]);

        render(<Education eventKey="5" />);

        expect(screen.getByText(/Engineering/)).toBeInTheDocument();
        expect(screen.getByText('September 2018 - July 2020')).toBeInTheDocument();
    });
});
