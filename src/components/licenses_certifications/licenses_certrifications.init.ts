

import { useTranslation } from "react-i18next";
import { LicenseCertification } from "./license_certification";
import { resolveDate } from "../common/utils";

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