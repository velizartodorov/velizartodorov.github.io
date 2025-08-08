import i18next from 'i18next'; 

export function resolveDate(dateStr?: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/^\{\{\s*dates:([\w_-]+)\s*\}\}$/);
  if (!match) return dateStr;

  const key = match[1];
  const value = i18next.t(key, { ns: 'dates' });
  return value !== key ? value : '';
}

export function parsePeriod(period: { start?: string; end?: string }) {
  const startStr = resolveDate(period.start);
  const endStr = resolveDate(period.end);
  return {
    start: startStr ? new Date(startStr) : new Date(0),
    end: endStr ? new Date(endStr) : new Date(0),
  };
}

export function currentDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export const bullet = '\u2022';