import { useTranslation } from "react-i18next";
import { LicenseCertification } from "./license_certification";

export function useLicensesCertifications(): LicenseCertification[] {
    // Explicitly load both 'licenses_certifications' and 'dates' namespaces
    const { t, ready } = useTranslation(['licenses_certifications', 'dates']);
    if (!ready) return [];
    const list = t('licenses_certifications:list', { returnObjects: true }) as any[];
    const resolveDate = (dateStr: string | undefined) => {
        if (!dateStr) return '';
        let resolved = dateStr;
        const templateMatch = dateStr.match(/^\{\{\s*dates:([\w_\-]+)\s*\}\}$/);
        if (templateMatch) {
            const key = templateMatch[1];
            const value = t(key, { ns: 'dates' });
            // If t returns the key itself, treat as missing
            resolved = (value === key) ? '' : value;
        }
        return resolved;
    };
    return Array.isArray(list)
        ? list.map((item: any) => ({
            name: item.name ?? '',
            institution: item.institution ?? '',
            field: item.field ?? '',
            date: resolveDate(item.date),
            icon: item.icon ?? '',
            link: item.link ?? '',
        }))
        : [];
}