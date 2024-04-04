import { Period } from "../common/period";
import { currentDate, monthYear } from "../common/utils";

export function display(period: Period): string {
    const formattedStartDate = monthYear(period.start);
    const formattedEndDate = monthYear(period.end);
    const periodDiff = periodDifference(period);

    return formattedEndDate === monthYear(currentDate())
        ? `${formattedStartDate} - Present ${!periodDiff ? periodDiff : ''}`
        : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
}

export function periodDifference(period: Period): string {
    const diff = yearMonthDiff(period);
    return diff ? `${diff}` : '';
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