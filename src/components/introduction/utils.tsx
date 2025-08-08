import { useTranslation } from 'react-i18next';
import { useEmployments } from "../employments/employments.init";

export function useIntroductionStats() {
    const { t } = useTranslation();
    const employments = useEmployments();

    const telnetEmployment = employments.find(e =>
        e.company.toLowerCase().includes('telnet')
    );

    const softwareEmployments = employments
        .filter(e => e.company !== (telnetEmployment?.company ?? ''))
        .map(e => ({
            start: new Date(e.period.start),
            end: new Date(e.period.end),
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
    return template.replace(/\{(\w+)\}/g, (_, key) =>
        vars[key] !== undefined ? String(vars[key]) : `{${key}}`
    );
}

function mergeOverlappingPeriods(periods: { start: Date; end: Date }[]): { start: Date; end: Date }[] {
    if (periods.length === 0) return [];

    const sorted = periods.slice().sort((a, b) => a.start.getTime() - b.start.getTime());
    const merged: { start: Date; end: Date }[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        const last = merged[merged.length - 1];
        const current = sorted[i];

        if (last.end < current.start) {
            merged.push({ ...current });
        } else {
            last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
        }
    }

    return merged;
}

function sumDateDifferences(periods: { start: Date; end: Date }[]) {
    let totalYears = 0, totalMonths = 0, totalDays = 0;

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