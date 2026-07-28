import { describe, expect, it, vi } from 'vitest';
import { renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EducationItem from './education_item';
import { useDisplayPeriod } from './utils';
import { loadAllStrings } from '../../app/translations/resources';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { renderInTimeline } from '../../test-utils/render-in-timeline';
import { educationEntry } from '../../test-utils/education-fixtures';
import { CHEVRON_TOGGLE_LABEL } from '../common/chevron_toggle_button';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

const strings = await loadAllStrings();

function mockTranslation() {
    mockUseTranslation((key: string) => strings('en', key));
}

function displayPeriod(p: ReturnType<typeof educationEntry>['period']): string {
    return renderHook(() => useDisplayPeriod()).result.current.display(p);
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
        expect(screen.getByText(displayPeriod(educationEntry().period))).toBeInTheDocument();
    });

    it('renders without crashing when body is empty, and omits the chevron since there is nothing to expand', () => {
        mockTranslation();
        renderItem(educationEntry({ body: '' }));

        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
        expect(screen.queryByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })).not.toBeInTheDocument();
    });

    it("renders the entry's chevron toggle, which pins its content open regardless of scroll", async () => {
        mockTranslation();
        renderItem(educationEntry({ body: 'Some description' }));

        const chevron = screen.getByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed });
        expect(chevron).toHaveAttribute('aria-expanded', 'false');

        await userEvent.click(chevron);

        expect(screen.getByRole('button', { name: CHEVRON_TOGGLE_LABEL.open })).toHaveAttribute(
            'aria-expanded',
            'true',
        );
    });
});
