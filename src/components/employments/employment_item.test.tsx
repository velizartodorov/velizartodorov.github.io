import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import EmploymentItem from './employment_item';
import { Employment } from './employment';
import { MONTHS, PERIOD_LANG } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { renderInAccordion } from '../../test-utils/render-in-accordion';
import { employment, multiPositionEmployment, singlePositionEmployment } from '../../test-utils/employment-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation() {
    mockUseTranslation((key: string) => {
        if (key === 'common:months') return MONTHS;
        if (key === 'common:period') return PERIOD_LANG;
        if (key === 'common:period.at') return 'at';
        if (key === 'common:companyType') return 'Type';
        return key;
    });
}

function renderItem(item: Employment) {
    return renderInAccordion(<EmploymentItem item={item} index={0} eventKey="0" />);
}

describe('EmploymentItem', () => {
    it('renders a single-position employment without a per-position title, with its type', () => {
        mockTranslation();
        renderItem(singlePositionEmployment());

        expect(screen.getByText(/Engineer at Acme/)).toBeInTheDocument();
        expect(screen.getByText(/Did engineering things/)).toBeInTheDocument();
        expect(screen.getByText(/Type: Full-time/)).toBeInTheDocument();
        // Single position: no separate per-position title is rendered.
        expect(screen.queryByText('Engineer', { selector: 'h3, h4, h5, h6' })).not.toBeInTheDocument();
    });

    it('renders a multi-position employment with a per-position title and period for each, without a type', () => {
        mockTranslation();
        renderItem(multiPositionEmployment());

        expect(screen.getByText('Engineer')).toBeInTheDocument();
        expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
        expect(screen.getByText(/Led a team/)).toBeInTheDocument();
        expect(screen.queryByText(/Type:/)).not.toBeInTheDocument();
    });

    it('renders an empty positions list without crashing', () => {
        mockTranslation();
        renderItem(employment({ company: 'Acme' }));

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('defaults to an empty positions list when positions is missing entirely', () => {
        mockTranslation();
        // Deliberately malformed (no `positions` key at all) — the employment() fixture always
        // fills that in, so this one case is a raw literal on purpose.
        renderItem({ company: 'Acme', icon: '', type: '' } as unknown as Employment);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
