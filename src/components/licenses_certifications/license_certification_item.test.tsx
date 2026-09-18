import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LicenseCertificationItem from './license_certification_item';
import { LicenseInstitution } from './license_certification';
import { loadAllStrings } from '../../app/translations/resources';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { renderInTimeline } from '../../test-utils/render-in-timeline';
import {
    multiCertInstitution,
    singleCertInstitution,
    undatedCertInstitution,
} from '../../test-utils/certification-fixtures';
import { CHEVRON_TOGGLE_LABEL } from '../common/chevron_toggle_button';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

const strings = await loadAllStrings();
const months = strings('en', 'common:months') as string[];

function mockTranslation() {
    mockUseTranslation((key: string) => strings('en', key));
}

function renderItem(item: LicenseInstitution) {
    mockIntersectionObserver();
    mockMatchMedia();
    return renderInTimeline(<LicenseCertificationItem item={item} index={0} />);
}

describe('LicenseCertificationItem', () => {
    it('shows a header period spanning multiple certifications, links the ones with a link', () => {
        mockTranslation();
        renderItem(multiCertInstitution());

        expect(screen.getByText(/January 2020 - June 2021/)).toBeInTheDocument();

        const link = screen.getByRole('link', { name: /Cert A/ });
        expect(link).toHaveAttribute('href', 'https://example.com/a');
        expect(screen.getAllByText('Field A')).toHaveLength(2);

        expect(screen.queryByRole('link', { name: /Cert B/ })).not.toBeInTheDocument();
        expect(screen.getByText('Cert B')).toBeInTheDocument();
    });

    it('omits the header period for a single certification', () => {
        mockTranslation();
        renderItem(singleCertInstitution());

        expect(screen.queryByText(/January 2020 - January 2020/)).not.toBeInTheDocument();
    });

    it('omits the month/year and field when a certification has no date or field', () => {
        mockTranslation();
        renderItem(undatedCertInstitution());

        expect(screen.getByText('Undated Cert')).toBeInTheDocument();
        months.forEach((month) => expect(screen.queryByText(new RegExp(month))).not.toBeInTheDocument());
    });

    it('renders without crashing when certifications is missing', () => {
        mockTranslation();
        renderItem({ institution: 'AWS', icon: '' } as unknown as LicenseInstitution);

        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it("renders only the entry's own chevron toggle, since certification rows have no extra content to collapse", () => {
        mockTranslation();
        renderItem(multiCertInstitution());

        // Certification rows are just a title/field/date header with nothing else behind them,
        // so TimelineRow renders no chevron for them - only the entry itself has one.
        expect(screen.getAllByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })).toHaveLength(1);
    });

    it("the entry's chevron pins its own header open, revealing all certification rows immediately", async () => {
        mockTranslation();
        renderItem(multiCertInstitution());

        const entryChevron = screen.getByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed });
        await userEvent.click(entryChevron);

        expect(screen.getByRole('button', { name: CHEVRON_TOGGLE_LABEL.open })).toBeInTheDocument();
        expect(screen.getByText('Cert A')).toBeInTheDocument();
        expect(screen.getByText('Cert B')).toBeInTheDocument();
    });
});
