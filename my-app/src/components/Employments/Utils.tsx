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

export function getMonth(month: number): String {
    return months[month - 1];
}

export function yearMonthDiff(startDate: Date, endDate: Date): string {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear())
        * 12 - startDate.getMonth() + endDate.getMonth();
    return monthDiff >= 12
        ? `${Math.floor(monthDiff / 12)} years, ${monthDiff % 12} months`
        : `${monthDiff} months`;
}