import { Certification, LicenseInstitution } from '../components/licenses_certifications/license_certification';

// Builds a resolved Certification/LicenseInstitution. Not a fit for tests that construct a
// deliberately sparse/malformed raw shape to exercise a hook's own `??` defaulting (see
// licenses_certifications.init.test.ts) — this fixture's defaults would mask exactly the
// missing-field cases those tests need.
export function certification(overrides: Partial<Certification> = {}): Certification {
    return { name: 'Certification', field: '', date: '', link: '', ...overrides };
}

export function licenseInstitution(overrides: Partial<LicenseInstitution> = {}): LicenseInstitution {
    return { institution: 'Institution', icon: '', certifications: [], ...overrides };
}

// All named institution fixtures below use the same real-world institution.
const AWS = 'AWS';

// Concrete institutions used by license_certification_row.test.tsx — named so the
// linked-vs-unlinked test intent reads at the call site instead of being buried in inline
// overrides.
export function linkedInstitution(): LicenseInstitution {
    return licenseInstitution({
        institution: AWS,
        certifications: [
            certification({ name: 'Cert A', field: 'Field', date: '2020-01-01', link: 'https://example.com' }),
        ],
    });
}

export function unlinkedInstitution(): LicenseInstitution {
    return licenseInstitution({
        institution: AWS,
        certifications: [certification({ name: 'Cert B', field: 'Field', date: '2020-01-01' })],
    });
}

// Concrete institutions used by license_certification_item.test.tsx — named so each test's
// intent (multiple certs w/ mixed links, a single cert, an undated/unlabeled cert) reads at the
// call site instead of being buried in inline overrides.
export function multiCertInstitution(): LicenseInstitution {
    return licenseInstitution({
        institution: AWS,
        certifications: [
            certification({ name: 'Cert A', field: 'Field A', date: '2020-01-01', link: 'https://example.com/a' }),
            certification({ name: 'Cert B', date: '2021-06-01' }),
        ],
    });
}

export function singleCertInstitution(): LicenseInstitution {
    return licenseInstitution({
        institution: AWS,
        certifications: [certification({ name: 'Solo Cert', field: 'Field', date: '2020-01-01' })],
    });
}

export function undatedCertInstitution(): LicenseInstitution {
    return licenseInstitution({
        institution: AWS,
        certifications: [certification({ name: 'Undated Cert' })],
    });
}
