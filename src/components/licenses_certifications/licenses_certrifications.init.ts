import { useTranslation } from "react-i18next";
import { LicenseCertification } from "./license_certification";
import { resolveDate } from "../common/utils";

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

export function useLicensesCertifications(): LicenseCertification[] {
    const { t, ready } = useTranslation(["licenses_certifications", "dates"]);
    if (!ready) return [];

    const list = t("licenses_certifications:list", { returnObjects: true }) as Record<string, any>[];


    if (!Array.isArray(list)) return [];

    return list.map((item) => ({
        name: item.name ?? "",
        institution: item.institution ?? "",
        field: item.field ?? "",
        date: resolveDate(item.date, t),
        icon: item.icon ?? "",
        link: item.link ?? "",
    }));
}