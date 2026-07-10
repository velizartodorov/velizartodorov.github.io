import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import Education from './education';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const PERIOD_LANG = { present: 'Present', at: 'at' };

function mockTranslation(list: unknown) {
    const t = vi.fn((key: string) => {
        if (key === 'education:list') return list;
        if (key === 'education:title') return 'Education';
        if (key === 'common:months') return MONTHS;
        if (key === 'common:period') return PERIOD_LANG;
        if (key === 'common:period.at') return 'at';
        return key;
    });
    vi.mocked(useTranslation).mockReturnValue({ t } as unknown as ReturnType<typeof useTranslation>);
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
                period: { start: new Date('2018-09-01'), end: new Date('2020-07-01') },
            },
        ]);

        render(<Education eventKey="5" />);

        expect(screen.getByText(/Engineering/)).toBeInTheDocument();
        expect(screen.getByText('September 2018 - July 2020')).toBeInTheDocument();
    });
});
