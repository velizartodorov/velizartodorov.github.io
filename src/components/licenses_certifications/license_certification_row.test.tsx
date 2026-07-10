import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LicenseCertificationRow from './license_certification_row';
import { LicenseInstitution } from './license_certification';
import { MONTHS } from '../../test-utils/i18n-fixtures';
import { mockUseTranslation } from '../../test-utils/mock-use-translation';

vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }));

function mockTranslation() {
    mockUseTranslation((key: string) => (key === 'common:months' ? MONTHS : key));
}

describe('LicenseCertificationRow', () => {
    it('renders nothing when there are no certifications', () => {
        mockTranslation();
        const { container } = render(
            <LicenseCertificationRow item={{ institution: 'AWS', icon: '', certifications: [] }} />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders a linked row for a certification with a link', () => {
        mockTranslation();
        render(
            <LicenseCertificationRow
                item={{
                    institution: 'AWS',
                    icon: '',
                    certifications: [
                        { name: 'Cert A', field: 'Field', date: '2020-01-01', link: 'https://example.com' },
                    ],
                }}
            />,
        );

        expect(screen.getByRole('link', { name: /Cert A/ })).toHaveAttribute('href', 'https://example.com');
    });

    it('renders a plain (non-linked) row for a certification without a link', () => {
        mockTranslation();
        const item: LicenseInstitution = {
            institution: 'AWS',
            icon: '',
            certifications: [{ name: 'Cert B', field: 'Field', date: '2020-01-01', link: '' }],
        };
        render(<LicenseCertificationRow item={item} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByText('Cert B')).toBeInTheDocument();
    });
});
