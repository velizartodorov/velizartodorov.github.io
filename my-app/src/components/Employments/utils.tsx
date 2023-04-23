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
    const month = months[date.getMonth() - 1];
    const year = date.getFullYear();
    return `${month} ${year}`;
}

function periodDifference(period: Period): string {
    return yearMonthDiff(period.start, period.end)?.toString() || '';
}

export function yearMonthDiff(startDate: Date, endDate: Date): string {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear())
        * 12 - startDate.getMonth() + endDate.getMonth();
    return monthDiff >= 12
        ? `(${Math.floor(monthDiff / 12)} years, ${monthDiff % 12} months)`
        : `(${monthDiff} months)`;
}