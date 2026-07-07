import { Period } from './period';

// Minimal shape actually needed from react-i18next's `t` — avoids fighting i18next's generic
// TFunction typing across the several differently-namespaced `useTranslation()` call sites that
// call into this.
type Translate = (key: string, options: { ns: string }) => unknown;

// `dates.json` values are injected into other translation strings as literal
// "{{dates:some_key}}" placeholders (not i18next's own $t()-based nesting syntax), so they need
// resolving against the 'dates' namespace explicitly here. Must be resolved through the caller's
// own `t` (i.e. the active per-page i18next instance obtained via useTranslation()) rather than
// a module-level import of the raw i18next package: each page/language now uses its own cloned,
// isolated instance (see src/i18n.ts), and the base i18next singleton never has any resources
// registered on it directly.
export function resolveDate(dateStr: string, t: Translate): string {
    if (!dateStr) return '';
    const match = new RegExp(/^\{\{\s*dates:([\w-]+)\s*}}$/).exec(dateStr);
    if (!match) return dateStr;

    const key = match[1];
    if (!key) return '';
    const value = t(key, { ns: 'dates' });
    return value === key ? '' : (value as string);
}

export function parsePeriod(period: Period, t: Translate) {
    const startStr = resolveDate(period.start.toString(), t);
    const endStr = period.end ? resolveDate(period.end.toString(), t) : '';
    return {
        start: startStr ? new Date(startStr) : new Date(0),
        end: endStr ? new Date(endStr) : undefined,
    };
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
