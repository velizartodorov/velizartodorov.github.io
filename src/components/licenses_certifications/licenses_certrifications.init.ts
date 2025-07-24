import { LicenseCertification } from "./license_certification";
import { useTranslation } from 'react-i18next';

export function useLicensesCertifications(): LicenseCertification[] {
    const { t } = useTranslation();
    const data = t('licenses:list', { returnObjects: true }) as any[];
    return data.map((item: any) => ({
        name: item.name ?? '',
        institution: item.institution ?? '',
        field: item.field ?? '',
        date: item.date ? new Date(item.date) : new Date(0),
        icon: item.icon ?? '',
        link: item.link ?? '',
    }));
}