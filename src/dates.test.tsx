import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import type { ReactElement } from 'react';
import Employments from './components/employments/employments';
import Education from './components/education/education';
import LicensesCertifications from './components/licenses_certifications/licenses_certifications';
import Introduction from './components/introduction/introduction';
import { createLangInstance } from './i18n';
import { resources as enResources } from './translations/en';

// Regression test for a real bug: date placeholders like "{{dates:collibra_start}}" must be
// resolved through the ACTIVE per-page i18next instance (the one obtained via useTranslation()'s
// `t`, passed down from src/App.tsx), not a disconnected direct import of the raw i18next
// package. The latter silently resolves nothing once each page/instance's resource store is
// isolated (see forkResourceStore in src/i18n.ts), which previously made every employment show
// today's date instead of its real start/end, every education entry show "January 1970", and the
// introduction's total-experience calculation collapse to "0 years, 0 months, 0 days".
//
// These tests render the real section components against a real createLangInstance()-built
// i18next instance (exactly how src/App.tsx builds it for production), rather than mocking `t`,
// since a mock would not exercise the actual instance-mismatch this bug was about.

vi.mock('./components/common/icon', () => ({ default: () => null }));

function renderWithI18n(ui: ReactElement) {
    const instance = createLangInstance('en', enResources);
    return render(<I18nextProvider i18n={instance}>{ui}</I18nextProvider>);
}

describe('date resolution and calculation', () => {
    it("renders each employment with its own real historical dates, not today's date", () => {
        renderWithI18n(<Employments eventKey="1" />);

        expect(screen.getByText(/October 2025 - June 2026 \(8 months\)/)).toBeInTheDocument(); // Collibra
        expect(screen.getByText(/April 2024 - April 2025 \(1 year\)/)).toBeInTheDocument(); // Docbyte

        // The regression made every employment collapse to the same "today - today" period;
        // guard against that directly by asserting these two real periods differ from each other.
        expect(screen.queryByText(/October 2025 - June 2026/)).not.toEqual(
            screen.queryByText(/April 2024 - April 2025/),
        );
    });

    it('renders each education entry with its own real historical dates, not the Unix epoch', () => {
        renderWithI18n(<Education eventKey="5" />);

        expect(screen.getByText('September 2017 - July 2018')).toBeInTheDocument(); // Software Engineering
        expect(screen.getByText('September 2013 - July 2017')).toBeInTheDocument(); // Computer Engineering
        expect(screen.getByText('September 2008 - May 2013')).toBeInTheDocument(); // German & English

        expect(screen.queryByText(/January 1970/)).not.toBeInTheDocument();
    });

    it('renders license/certification dates correctly resolved, not blank or invalid', () => {
        renderWithI18n(<LicensesCertifications eventKey="2" />);

        expect(screen.getByText('February 2025')).toBeInTheDocument(); // AWS Essentials
        expect(screen.getByText('December 2012')).toBeInTheDocument(); // Deutsches Sprachdiplom (DSD)
    });

    it('calculates a realistic total years of experience, not zero', () => {
        renderWithI18n(<Introduction eventKey="0" />);

        const match = screen.getByText(/years of experience/i).textContent ?? '';
        const years = Number(/with (\d+) years? of experience/i.exec(match)?.[1]);

        expect(years).toBeGreaterThanOrEqual(5);
    });

    it('never renders "Invalid Date" or "NaN" anywhere in these sections', () => {
        renderWithI18n(
            <>
                <Introduction eventKey="0" />
                <Employments eventKey="1" />
                <LicensesCertifications eventKey="2" />
                <Education eventKey="5" />
            </>,
        );

        const body = document.body.textContent ?? '';
        expect(body).not.toMatch(/Invalid Date/);
        expect(body).not.toMatch(/NaN/);
    });
});
