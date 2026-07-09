import { useTranslation } from 'react-i18next';
import { Certification, LicenseInstitution } from './license_certification';
import { resolveDate } from '../common/utils';

export function useMonthYear() {
    const { t } = useTranslation();
    return (dateStr: string) => {
        if (!dateStr) return '';
        const months = t('common:months', { returnObjects: true }) as string[];
        const dateObj = new Date(dateStr);
        const month = dateObj.getMonth();
        const year = dateObj.getFullYear();
        return `${months[month]} ${year}`;
    };
}

export function useLicensesCertifications(): LicenseInstitution[] {
    const { t, ready } = useTranslation(['licenses_certifications', 'dates']);
    if (!ready) return [];

    const list = t('licenses_certifications:list', {
        returnObjects: true,
    }) as LicenseInstitution[];
    if (!Array.isArray(list)) return [];

    return list.map((group) => ({
        institution: group.institution ?? '',
        icon: group.icon ?? '',
        certifications: Array.isArray(group.certifications)
            ? group.certifications.map((c): Certification => ({
                  name: c.name ?? '',
                  field: c.field ?? '',
                  date: resolveDate(c.date, t),
                  link: c.link ?? '',
              }))
            : [],
    }));
}
