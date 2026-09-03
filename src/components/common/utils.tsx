import { Period } from './period';

type Translate = (key: string, options: { ns: string }) => unknown;

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

const DARK_GLYPH_ICONS = new Set(['/employments/dsi.png', '/education/udemy_icon.svg']);

export function iconInvertsOnDark(icon: string): true | undefined {
    return DARK_GLYPH_ICONS.has(icon) ? true : undefined;
}

const CONTAIN_FIT_ICONS = new Set([
    '/employments/dsi.png',
    '/employments/telnet.png',
    '/education/udemy_icon.svg',
    '/education/naric.svg',
]);

export function iconFit(icon: string): 'contain' | undefined {
    return CONTAIN_FIT_ICONS.has(icon) ? 'contain' : undefined;
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
