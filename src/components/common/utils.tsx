import { TFunction } from 'i18next';

export function resolveDate(dateStr: string | undefined, t: TFunction): string {
    if (!dateStr) return '';
    const match = dateStr.match(/^\{\{\s*dates:([\w_-]+)\s*\}\}$/);
    if (match) {
        const key = match[1];
        const value = t(key, { ns: 'dates' });
        return value !== key ? value : '';
    }
    return dateStr;
}

export function parsePeriod(period: any, t?: TFunction) {
    if (t) {
        return {
            start: period.start ? new Date(resolveDate(period.start, t)) : new Date(0),
            end: period.end ? new Date(resolveDate(period.end, t)) : new Date(0),
        };
    }
    return {
        start: period.start ? new Date(period.start) : new Date(0),
        end: period.end ? new Date(period.end) : new Date(0),
    };
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export const bullet = '\u2022';