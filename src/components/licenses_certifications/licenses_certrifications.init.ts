
import { useTranslation } from "react-i18next";
import { LicenseCertification } from "./license_certification";

export function useLicensesCertifications(): LicenseCertification[] {
  const { t, ready } = useTranslation(["licenses_certifications", "dates"]);
  if (!ready) return [];

  const list = t("licenses_certifications:list", { returnObjects: true }) as Record<string, any>[];

  function resolveDate(dateStr?: string): string {
    if (!dateStr) return "";
    const match = dateStr.match(/^\{\{\s*dates:([\w_\-]+)\s*\}\}$/);
    if (match) {
      const key = match[1];
      const value = t(key, { ns: "dates" });
      return value !== key ? value : "";
    }
    return dateStr;
  }

  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    name: item.name ?? "",
    institution: item.institution ?? "",
    field: item.field ?? "",
    date: resolveDate(item.date),
    icon: item.icon ?? "",
    link: item.link ?? "",
  }));
}