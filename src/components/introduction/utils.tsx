import { useTranslation } from 'react-i18next';
import { useEmployments } from '../employments/employments.init';

export function useIntroductionStats() {
    const { t } = useTranslation();
    const employments = useEmployments();

    const telnetCompany = employments.find((c) => c.company.toLowerCase().includes('telnet'));

    const softwareEmployments = employments
        .filter((c) => c.company !== (telnetCompany?.company ?? ''))
        .flatMap((c) => c.positions)
        .filter((p) => p.period.end)
        .map((p) => ({
            start: new Date(p.period.start),
            end: new Date(p.period.end!), // Safe to use ! because we filtered for existence
        }));

    const mergedPeriods = mergeOverlappingPeriods(softwareEmployments);
    const { years, months, days } = sumDateDifferences(mergedPeriods);

    const totalYears = years;
    const yearLabel = t(`common:period.${years === 1 ? 'year' : 'years'}`);
    const monthLabel = t(`common:period.${months === 1 ? 'month' : 'months'}`);
    const dayLabel = t(`common:period.${days === 1 ? 'day' : 'days'}`);
    const andLabel = t('common:period.and');

    const totalTime = `${years} ${yearLabel}, ${months} ${monthLabel}, ${andLabel} ${days} ${dayLabel}`;

    return { softwareEmployments, totalYears, totalTime };
}

export function useFormatBody(bodyRaw: unknown) {
    const { totalTime, totalYears } = useIntroductionStats();
    return Array.isArray(bodyRaw)
        ? interpolate(bodyRaw.join(' '), { totalTime, totalYears })
        : interpolate(String(bodyRaw), { totalTime, totalYears });
}

function interpolate(template: string, vars: Record<string, string | number>) {
    return template.replaceAll(/\{(\w+)}/g, (_, key) =>
        vars[key] === undefined ? `{${key}}` : String(vars[key]),
    );
}

function mergeOverlappingPeriods(
    periods: { start: Date; end: Date }[],
): { start: Date; end: Date }[] {
    if (periods.length === 0) return [];

    const sorted = periods.slice().sort((a, b) => a.start.getTime() - b.start.getTime());

    // We know first element exists because we checked length above
    const firstPeriod = sorted[0]!;

    // Initialize with a deep copy of the first period
    const merged: { start: Date; end: Date }[] = [
        {
            start: new Date(firstPeriod.start),
            end: new Date(firstPeriod.end),
        },
    ];

    // Process the rest of the periods
    for (const currentPeriod of sorted.slice(1)) {
        const lastMerged = merged.at(-1)!; // We know this exists as we initialized it

        if (lastMerged.end.getTime() < currentPeriod.start.getTime()) {
            // No overlap, add as new period
            merged.push({
                start: new Date(currentPeriod.start),
                end: new Date(currentPeriod.end),
            });
        } else {
            // Overlap exists, extend the end date if necessary
            lastMerged.end = new Date(
                Math.max(lastMerged.end.getTime(), currentPeriod.end.getTime()),
            );
        }
    }

    return merged;
}

function sumDateDifferences(periods: { start: Date; end: Date }[]) {
    let totalYears = 0,
        totalMonths = 0,
        totalDays = 0;

    for (const { start, end } of periods) {
        const diff = getExactDateDifference(start, end);
        totalYears += diff.years;
        totalMonths += diff.months;
        totalDays += diff.days;
    }

    if (totalDays >= 30) {
        totalMonths += Math.floor(totalDays / 30);
        totalDays %= 30;
    }
    if (totalMonths >= 12) {
        totalYears += Math.floor(totalMonths / 12);
        totalMonths %= 12;
    }

    return { years: totalYears, months: totalMonths, days: totalDays };
}

function getExactDateDifference(start: Date, end: Date) {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += previousMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
}
