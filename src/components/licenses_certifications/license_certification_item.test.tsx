import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import LicenseCertificationItem from './license_certification_item';
import { LicenseInstitution } from './license_certification';
import { MONTHS } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { renderInAccordion } from '../../test-utils/render-in-accordion';
import { certification, licenseInstitution } from '../../test-utils/certification-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation() {
    mockUseTranslation((key: string) => (key === 'common:months' ? MONTHS : key));
}

function renderItem(item: LicenseInstitution) {
    return renderInAccordion(<LicenseCertificationItem item={item} index={0} eventKey="0" />);
}

describe('LicenseCertificationItem', () => {
    it('shows a header period spanning multiple certifications, links the ones with a link', () => {
        mockTranslation();
        renderItem(
            licenseInstitution({
                institution: 'AWS',
                certifications: [
                    certification({
                        name: 'Cert A',
                        field: 'Field A',
                        date: '2020-01-01',
                        link: 'https://example.com/a',
                    }),
                    certification({ name: 'Cert B', date: '2021-06-01' }),
                ],
            }),
        );

        expect(screen.getByText(/January 2020 - June 2021/)).toBeInTheDocument();

        const link = screen.getByRole('link', { name: /Cert A/ });
        expect(link).toHaveAttribute('href', 'https://example.com/a');
        // Appears twice: once as the header row's place, once in Cert A's own field span.
        expect(screen.getAllByText('Field A')).toHaveLength(2);

        // Cert B has no link, so it's rendered as a plain row, not an anchor.
        expect(screen.queryByRole('link', { name: /Cert B/ })).not.toBeInTheDocument();
        expect(screen.getByText('Cert B')).toBeInTheDocument();
    });

    it('omits the header period for a single certification', () => {
        mockTranslation();
        renderItem(
            licenseInstitution({
                institution: 'AWS',
                certifications: [certification({ name: 'Solo Cert', field: 'Field', date: '2020-01-01' })],
            }),
        );

        expect(screen.queryByText(/January 2020 - January 2020/)).not.toBeInTheDocument();
    });

    it('omits the month/year and field when a certification has no date or field', () => {
        mockTranslation();
        renderItem(
            licenseInstitution({
                institution: 'AWS',
                certifications: [certification({ name: 'Undated Cert' })],
            }),
        );

        expect(screen.getByText('Undated Cert')).toBeInTheDocument();
        MONTHS.forEach((month) => expect(screen.queryByText(new RegExp(month))).not.toBeInTheDocument());
    });

    it('renders without crashing when certifications is missing', () => {
        mockTranslation();
        // Deliberately malformed (no `certifications` key at all) — the licenseInstitution()
        // fixture always fills that in, so this one case is a raw literal on purpose.
        renderItem({ institution: 'AWS', icon: '' } as unknown as LicenseInstitution);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
