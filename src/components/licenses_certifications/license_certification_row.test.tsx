import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LicenseCertificationRow from './license_certification_row';
import { MONTHS } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';
import { licenseInstitution, linkedInstitution, unlinkedInstitution } from '../../test-utils/certification-fixtures';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation() {
    mockUseTranslation((key: string) => (key === 'common:months' ? MONTHS : key));
}

describe('LicenseCertificationRow', () => {
    it('renders nothing when there are no certifications', () => {
        mockTranslation();
        const { container } = render(<LicenseCertificationRow item={licenseInstitution({ institution: 'AWS' })} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders a linked row for a certification with a link', () => {
        mockTranslation();
        render(<LicenseCertificationRow item={linkedInstitution()} />);

        expect(screen.getByRole('link', { name: /Cert A/ })).toHaveAttribute('href', 'https://example.com');
    });

    it('renders a plain (non-linked) row for a certification without a link', () => {
        mockTranslation();
        render(<LicenseCertificationRow item={unlinkedInstitution()} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByText('Cert B')).toBeInTheDocument();
    });
});
