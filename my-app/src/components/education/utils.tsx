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

export function bullet(): string {
    return '\u2022';
}

export function display(period: Period): string {
    const formattedStartDate = monthYear(period.start);
    const formattedEndDate = monthYear(period.end);

    return formattedEndDate === monthYear(currentDate())
        ? `${formattedStartDate} - Present`
        : `${formattedStartDate} - ${formattedEndDate}`;
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function monthYear(date: Date): string {
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${months[month]} ${year}`;
}