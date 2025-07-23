import enCommon from './common.en.json';
import nlCommon from './common.nl.json';

export const SERVICE = 'Service';
export const PRODUCT = 'Product';
export const CONSULTANCY = 'Consultancy';

export function bullet(): string {
    return '\u2022';
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function monthYear(date: Date, lang: 'en' | 'nl' = 'en'): string {
    const months = lang === 'nl' ? nlCommon.months : enCommon.months;
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${months[month]} ${year}`;
}

export function getImageUrl(imageUrl: string) {
    return process.env.PUBLIC_URL + imageUrl;
}

export function parsePeriod(period: any) {
    return {
        start: period.start ? new Date(period.start) : new Date(0),
        end: period.end ? new Date(period.end) : new Date(0),
    };
}