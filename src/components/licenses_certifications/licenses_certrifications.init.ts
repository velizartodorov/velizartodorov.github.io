import { useTranslation } from "react-i18next";
import { LicenseCertification } from "./license_certification";

export function useLicensesCertifications(): LicenseCertification[] {
    const { t } = useTranslation();
    const list = t('licenses_certifications:list', { returnObjects: true }) as any[];
    return Array.isArray(list)
        ? list.map((item: any) => ({
           name: item.name ?? '',
            institution: item.institution ?? '',
            field: item.field ?? '',
            date: item.date ? new Date(item.date) : new Date(0),
            icon: item.icon ?? '',
            link: item.link ?? '',
        }))
        : [];
}