import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EducationItem from './education_item';
import { MONTHS, PERIOD_LANG } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { renderInTimeline } from '../../test-utils/render-in-timeline';
import { educationEntry } from '../../test-utils/education-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation() {
    mockUseTranslation((key: string) => {
        if (key === 'common:months') return MONTHS;
        if (key === 'common:period') return PERIOD_LANG;
        if (key === 'common:period.at') return 'at';
        return key;
    });
}

function renderItem(item: ReturnType<typeof educationEntry>) {
    mockIntersectionObserver();
    mockMatchMedia();
    return renderInTimeline(<EducationItem item={item} index={0} />);
}

describe('EducationItem', () => {
    it('renders the occupation, institution, place, period, and body', () => {
        mockTranslation();
        renderItem(educationEntry());

        expect(screen.getByText(/Engineering at Tech University/)).toBeInTheDocument();
        expect(screen.getByText('September 2018 - July 2020')).toBeInTheDocument();
    });

    it('renders without crashing when body is empty, and omits the chevron since there is nothing to expand', () => {
        mockTranslation();
        renderItem(educationEntry({ body: '' }));

        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
        expect(screen.queryByRole('button', { name: 'Expand' })).not.toBeInTheDocument();
    });

    it("renders the entry's chevron toggle, which pins its content open regardless of scroll", async () => {
        mockTranslation();
        renderItem(educationEntry({ body: 'Some description' }));

        const chevron = screen.getByRole('button', { name: 'Expand' });
        expect(chevron).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(chevron);

        expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute('aria-expanded', 'true');
    });
});
