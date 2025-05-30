import { Period } from "../common/period";
import { employments } from "../employments/employments.init";
import { telnet } from "../employments/employments/telnet";

export function totalYears(): number {
    return getSofwareEmployments().reduce((totalYears, period) => {
        return totalYears + yearsDifference(period);
    }, 0);
}

export function totalTime(): string {
    const totalPeriod = getSofwareEmployments().reduce(
        (total, period) => {
            const diff = exactDateDifference(period.start, period.end);
            total.years += diff.years;
            total.months += diff.months;
            total.days += diff.days;

            if (total.days >= 30) {
                total.months += Math.floor(total.days / 30);
                total.days %= 30;
            }
            if (total.months >= 12) {
                total.years += Math.floor(total.months / 12);
                total.months %= 12;
            }
            return total;
        },
        { years: 0, months: 0, days: 0 }
    );

    return `${totalPeriod.years} years, ${totalPeriod.months} months, and ${totalPeriod.days} days`;
}

function getSofwareEmployments(): Period[] {
    return employments
    .filter((employment) => employment.company !== telnet.company)
    .map((employment) => ({
        start: employment.period.start,
        end: employment.period.end,
    }));
}

function yearsDifference(period: Period): number {
    return period.end.getFullYear() - period.start.getFullYear();
}

function exactDateDifference(start: Date, end: Date) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months -= 1;
        days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
}
