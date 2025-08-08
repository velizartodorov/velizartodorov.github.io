import { TFunction } from 'i18next';

export const bullet = '\u2022';

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function resolveDate(dateStr: string | undefined, t: TFunction): string {
  if (!dateStr) return "";
  const match = dateStr.match(/^\{\{\s*dates:([\w_\-]+)\s*\}\}$/);
  if (match) {
    const key = match[1];
    const value = t(key, { ns: "dates" });
    return value !== key ? value : "";
  }
  return dateStr;
}