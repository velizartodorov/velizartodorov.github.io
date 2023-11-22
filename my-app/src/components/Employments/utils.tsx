import { Period } from "./period";

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

export function display(period: Period): string {
    const formattedStartDate = monthYear(period.start);
    const formattedEndDate = monthYear(period.end);
    const periodDiff = periodDifference(period);

    return formattedStartDate === formattedEndDate
        ? `${formattedStartDate} - Present`
        : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
}

function monthYear(date: Date): string {
    let month = date.getMonth() - 1;
    let year = date.getFullYear();

    if (month === -1) {
        month = 11; // Set to December
        year -= 1; // Decrement the year for January
    }

    const previousMonth = months[month];
    return `${previousMonth} ${year}`;
}

function periodDifference(period: Period): string {
    return yearMonthDiff(period.start, period.end)?.toString() || '';
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