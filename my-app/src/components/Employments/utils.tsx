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

export function periodDifference(start: Date, end: Date): string {
    return yearMonthDiff(start, end)?.toString() || '';
}

export function formatDate(date: Date): string {
    const month = months[date.getMonth() - 1];
    const year = date.getFullYear();
    return `${month} ${year}`;
}

export function yearMonthDiff(startDate: Date, endDate: Date): string {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear())
        * 12 - startDate.getMonth() + endDate.getMonth();
    return monthDiff >= 12
        ? `(${Math.floor(monthDiff / 12)} years, ${monthDiff % 12} months)`
        : `(${monthDiff} months)`;
}