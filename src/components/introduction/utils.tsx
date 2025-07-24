
import { $SpecialObject } from 'i18next/typescript/helpers';
import { useTranslation } from 'react-i18next';
import { Period } from "../common/period";
import { useEmployments } from "../employments/employments.init";

export function useIntroductionStats() {
    const { t } = useTranslation();
    const employments = useEmployments();
    const telnetEmployment = employments.find(e => e.company.toLowerCase().includes('telnet'));
    const softwareEmployments = employments
        .filter((employment) => employment.company !== (telnetEmployment?.company ?? ''))
        .map((employment) => ({
            start: employment.period.start,
            end: employment.period.end,
        }));

    const totalYears = softwareEmployments.reduce((total: number, period: Period) => {
        return total + yearsDifference(period);
    }, 0);

    const periods = softwareEmployments.map(p => ({ start: new Date(p.start), end: new Date(p.end) }));
    const merged = mergePeriods(periods);
    const { totalYears: sumYears, totalMonths, totalDays } = sumPeriods(merged);
    const yearLabel = t(`common:period.${sumYears === 1 ? 'year' : 'years'}`);
    const monthLabel = t(`common:period.${totalMonths === 1 ? 'month' : 'months'}`);
    const dayLabel = t(`common:period.${totalDays === 1 ? 'day' : 'days'}`);
    const andLabel = t('common:period.and');
    const totalTime = `${sumYears} ${yearLabel}, ${totalMonths} ${monthLabel}, ${andLabel} ${totalDays} ${dayLabel}`;

    return { softwareEmployments, totalYears, totalTime };
}

export function useFormatBody(bodyRaw: $SpecialObject) {
    const { totalTime, totalYears } = useIntroductionStats();
    return Array.isArray(bodyRaw)
        ? interpolate(bodyRaw.join(' '), { totalTime, totalYears })
        : interpolate(String(bodyRaw), { totalTime, totalYears });
}

export function interpolate(str: string, vars: Record<string, string | number>) {
    return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? String(vars[k]) : `{${k}}`);
}

function mergePeriods(periods: { start: Date; end: Date }[]): { start: Date; end: Date }[] {
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

function sumPeriods(periods: { start: Date; end: Date }[]) {
    let totalYears = 0, totalMonths = 0, totalDays = 0;
    for (const period of periods) {
        const diff = exactDateDifference(period.start, period.end);
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
    return { totalYears, totalMonths, totalDays };
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