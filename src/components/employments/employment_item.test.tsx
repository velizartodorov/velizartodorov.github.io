import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmploymentItem from './employment_item';
import { Employment } from './employment';
import { loadAllStrings } from '../../app/translations/resources';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { renderInTimeline } from '../../test-utils/render-in-timeline';
import { employment, multiPositionEmployment, singlePositionEmployment } from '../../test-utils/employment-fixtures';
import { CHEVRON_TOGGLE_LABEL } from '../common/chevron_toggle_button';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

const strings = await loadAllStrings();
const companyType = String(strings('en', 'common:companyType'));

function mockTranslation() {
    mockUseTranslation((key: string) => strings('en', key));
}

function renderItem(item: Employment) {
    mockIntersectionObserver();
    mockMatchMedia();
    return renderInTimeline(<EmploymentItem item={item} index={0} />);
}

describe('EmploymentItem', () => {
    it('renders a single-position employment without a per-position title, with its type', () => {
        mockTranslation();
        renderItem(singlePositionEmployment());

        expect(screen.getByText(/Engineer at Acme/)).toBeInTheDocument();
        expect(screen.getByText(/Did engineering things/)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${companyType}: Full-time`))).toBeInTheDocument();
        // Single position: no separate per-position title is rendered.
        expect(screen.queryByText('Engineer', { selector: 'h3, h4, h5, h6' })).not.toBeInTheDocument();
    });

    it('renders a multi-position employment with a per-position title and period for each, without a type', () => {
        mockTranslation();
        renderItem(multiPositionEmployment());

        expect(screen.getByText('Engineer')).toBeInTheDocument();
        expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
        expect(screen.getByText(/Led a team/)).toBeInTheDocument();
        expect(screen.queryByText(new RegExp(`${companyType}:`))).not.toBeInTheDocument();
    });

    it('renders an empty positions list without crashing', () => {
        mockTranslation();
        renderItem(employment({ company: 'Acme' }));

        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('defaults to an empty positions list when positions is missing entirely', () => {
        mockTranslation();
        // Deliberately malformed (no `positions` key at all) — the employment() fixture always
        // fills that in, so this one case is a raw literal on purpose.
        renderItem({ company: 'Acme', icon: '', type: '' } as unknown as Employment);

        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it("renders only the entry's own chevron toggle for a single position, with no internal timeline", () => {
        mockTranslation();
        renderItem(singlePositionEmployment());

        // Single position: no nested TimelineRail/TimelineRow, so no per-position chevron.
        expect(screen.getAllByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })).toHaveLength(1);
    });

    it("renders only the entry's own chevron toggle, since position rows have no separate collapse", () => {
        mockTranslation();
        renderItem(multiPositionEmployment());

        // 1 for the entry itself - each position's description is part of its row's always-visible
        // header now, not collapsible content, so no per-position chevron.
        expect(screen.getAllByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })).toHaveLength(1);
    });

    it("the entry's chevron pins its own header open, revealing all position rows immediately", async () => {
        mockTranslation();
        renderItem(multiPositionEmployment());

        const entryChevron = screen.getByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed });
        await userEvent.click(entryChevron);

        expect(screen.getByRole('button', { name: CHEVRON_TOGGLE_LABEL.open })).toBeInTheDocument();
        expect(screen.getByText('Engineer')).toBeInTheDocument();
        expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    });
});
