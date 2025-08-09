import i18next from 'i18next'; 

export function resolveDate(dateStr?: string, i18n?: any): string {
  if (!dateStr) return '';
  
  console.debug(`resolveDate called with: ${dateStr}`);
  
  const match = dateStr.match(/^\{\{\s*dates:([\w_-]+)\s*\}\}$/);
  if (!match) {
    console.debug(`No date template found, returning original: ${dateStr}`);
    return dateStr;
  }

  const key = match[1];
  console.debug(`Found date key: ${key}`);
  
  // Use the provided i18n instance if available, otherwise fall back to i18next
  const i18nInstance = i18n || i18next;
  
  // Check if the dates namespace is loaded
  if (!i18nInstance.hasResourceBundle(i18nInstance.language, 'dates')) {
    console.warn(`Dates namespace not loaded for language ${i18nInstance.language}`);
    return dateStr; // Return original string if namespace not loaded
  }
  
  const value = i18nInstance.t(key, { ns: 'dates' });
  console.debug(`Translation result for ${key}: ${value}`);
  
  if (value !== key && value) {
    console.debug(`Successfully resolved date: ${dateStr} -> ${value}`);
    return value;
  } else {
    console.warn(`Failed to resolve date key ${key}, returning original: ${dateStr}`);
    return dateStr; // Return original string if translation fails
  }
}

export function parsePeriod(period: { start?: string; end?: string }, i18n?: any) {
  const startStr = resolveDate(period.start, i18n);
  const endStr = resolveDate(period.end, i18n);
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