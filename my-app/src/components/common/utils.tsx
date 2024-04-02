import { Period } from "./period";

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const HASSELT_REMOTE = 'Hasselt, Belgium (Remote)';
export const GHENT_CONTRACT = 'Ghent, Belgium (Contract)';
export const GHENT = 'Ghent, Belgium';
export const RUSE = 'Rousse, Bulgaria';
export const UNVERSITY_RUSE = 'University of Rousse';
export const VELIKO_TARNOVO = 'Veliko Tarnovo, Bulgaria';
export const ELENA = 'Elena, Bulgaria';

export const SERVICE = 'Service';
export const PRODUCT = 'Product';
export const COSULTANCY = 'Consultancy';

export function bullet(): string {
    return '\u2022';
}

export function display(period: Period): string {
    const formattedStartDate = monthYear(period.start);
    const formattedEndDate = monthYear(period.end);
    const periodDiff = periodDifference(period);

    return formattedEndDate === monthYear(currentDate())
        ? `${formattedStartDate} - Present ${!periodDiff ? periodDiff : ''}`
        : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function monthYear(date: Date): string {
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${months[month]} ${year}`;
}

export function periodDifference(period: Period): string {
    const diff = yearMonthDiff(period);
    return diff ? `${diff}` : '';
}

export function yearsDiff(period: Period): number {
    return period.end.getFullYear() - period.start.getFullYear();
}

export function yearMonthDiff(period: Period): string {
    const monthDiff = (period.end.getFullYear() - period.start.getFullYear()) * 12
        + (period.end.getMonth() - period.start.getMonth());
    const yearDiff = Math.floor(monthDiff / 12);
    const remainingMonths = monthDiff % 12;
    const yearString = yearDiff > 0 ? `${yearDiff} years` : '';
    const monthString = remainingMonths > 0 ? `${remainingMonths} months` : '';
    const separator = yearString && monthString ? ', ' : '';
    return `(${yearString}${separator}${monthString})`;
}