export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function yearsDiff(startDate: Date, endDate: Date): string {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    return `${yearDiff}`;
}