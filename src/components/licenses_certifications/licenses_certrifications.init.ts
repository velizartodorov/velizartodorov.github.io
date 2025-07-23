import { LicenseCertification } from "./license_certification";
import enData from "./licenses_certifications.en.json";

export const licensesCertifications: LicenseCertification[] = (enData.data as any[]).map(item => ({
    ...item,
    date: item.date ? new Date(item.date) : undefined
}));