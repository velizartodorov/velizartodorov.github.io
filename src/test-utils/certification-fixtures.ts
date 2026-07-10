import { Certification, LicenseInstitution } from '../components/licenses_certifications/license_certification';

// Builds a resolved Certification/LicenseInstitution. Not a fit for tests that construct a
// deliberately sparse/malformed raw shape to exercise a hook's own `??` defaulting (see
// licenses_certrifications.init.test.ts) — this fixture's defaults would mask exactly the
// missing-field cases those tests need.
export function certification(overrides: Partial<Certification> = {}): Certification {
    return { name: 'Certification', field: '', date: '', link: '', ...overrides };
}

export function licenseInstitution(
    overrides: Partial<Omit<LicenseInstitution, 'certifications'>> & { certifications?: Certification[] } = {},
): LicenseInstitution {
    return { institution: 'Institution', icon: '', certifications: [], ...overrides };
}

// Concrete institutions used by license_certification_row.test.tsx — named so the
// linked-vs-unlinked test intent reads at the call site instead of being buried in inline
// overrides.
export function linkedInstitution(): LicenseInstitution {
    return licenseInstitution({
        institution: 'AWS',
        certifications: [
            certification({ name: 'Cert A', field: 'Field', date: '2020-01-01', link: 'https://example.com' }),
        ],
    });
}

export function unlinkedInstitution(): LicenseInstitution {
    return licenseInstitution({
        institution: 'AWS',
        certifications: [certification({ name: 'Cert B', field: 'Field', date: '2020-01-01' })],
    });
}
