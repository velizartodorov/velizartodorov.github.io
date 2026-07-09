export interface Certification {
    name: string;
    field: string;
    date: string;
    link?: string;
}

export interface LicenseInstitution {
    institution: string;
    icon: string;
    certifications: Certification[];
}
