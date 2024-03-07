import { Period } from "../employments/period";

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export function bullet(): string {
    return '\u2022';
}

export function display(period: Period): string {
    const formattedStartDate = monthYear(period.start);
    const formattedEndDate = monthYear(period.end);
    const periodDiff = periodDifference(period);

    return formattedEndDate === monthYear(currentDate())
        ? `${formattedStartDate} - Present ${periodDiff}`
        : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function monthYear(date: Date): string {
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${months[month]} ${year}`;
}

export function periodDifference(period: Period): string {
    const diff = yearMonthDiff(period.start, period.end);
    return diff ? `${diff}` : '';
}

export function yearsDiff(startDate: Date, endDate: Date): number {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    return yearDiff;
}

export function yearMonthDiff(startDate: Date, endDate: Date): string {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12
        + (endDate.getMonth() - startDate.getMonth());
    const yearDiff = Math.floor(monthDiff / 12);
    const remainingMonths = monthDiff % 12;
    const yearString = yearDiff > 0 ? `${yearDiff} years` : '';
    const monthString = remainingMonths > 0 ? `${remainingMonths} months` : '';
    const separator = yearString && monthString ? ', ' : '';
    return `(${yearString}${separator}${monthString})`;
}