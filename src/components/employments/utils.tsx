import {useTranslation} from 'react-i18next';
import {Period} from "../common/period";
import {currentDate} from "../common/utils";
import {Position} from "./employment";

export function combinedPeriod(positions: Position[]): Period | undefined {
    if (positions.length === 0) return undefined;
    let start = new Date(positions[0]!.period.start);
    let end: Date | undefined = positions[0]!.period.end
        ? new Date(positions[0]!.period.end)
        : undefined;
    let hasOpenEnded = !positions[0]!.period.end;

    for (const p of positions.slice(1)) {
        const s = new Date(p.period.start);
        if (s < start) start = s;
        if (p.period.end) {
            const e = new Date(p.period.end);
            if (!end || e > end) end = e;
        } else {
            hasOpenEnded = true;
        }
    }
    return {start, end: hasOpenEnded ? undefined : end};
}

export function useDisplayPeriod() {
    const {t} = useTranslation();

    function formatMonthYear(date: Date): string {
        const months = t('common:months', {returnObjects: true}) as string[];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    function formatDuration(duration: { years: number, months: number }): string {
        const periodLang = t('common:period', {returnObjects: true}) as Record<string, string>;
        const {years, months} = duration;

        function getYears() {
            return years === 1 ? periodLang.year : periodLang.years;
        }

        const yearString = years > 0
            ? `${years} ${(getYears())}`
            : '';

        function getMonths() {
            return months === 1 ? periodLang.month : periodLang.months;
        }

        const monthString = months > 0
            ? `${months} ${(getMonths())}`
            : '';

        const separator = yearString && monthString ? ', ' : '';
        return `${yearString}${separator}${monthString}`;
    }

    function yearMonthDiff(period: Period): string {
        if (!period.end) return '';
        const duration = calculateDuration(period.start, period.end);
        return formatDuration(duration);
    }


    function periodDifference(period: Period): string {
        const diff = yearMonthDiff(period);
        return diff ? `(${diff})` : '';
    }


    function display(period: Period): string {
        const today = currentDate();
        const periodLang = t('common:period', {returnObjects: true}) as Record<string, string>;
        const presentText = periodLang.present;
        const formattedStartDate = formatMonthYear(period.start);

        if (shouldShowPresent(period, today)) {
            return `${formattedStartDate} - ${presentText}`;
        }

        if (!period.end) {
            return `${formattedStartDate} - ${presentText}`;
        }

        const formattedEndDate = formatMonthYear(period.end);

        if (isFuturePeriod(period, today)) {
            return `${formattedStartDate} - ${formattedEndDate}`;
        }

        const periodDiff = periodDifference(period);
        const isCurrentMonth = formatMonthYear(period.end) === formatMonthYear(today);

        return isCurrentMonth
            ? `${formattedStartDate} - ${presentText} ${periodDifference({start: period.start, end: today})}`
            : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
    }

    return {display};
}

function calculateDuration(start: Date, end: Date): { years: number, months: number } {
    const monthDiff = (end.getFullYear() - start.getFullYear()) * 12
        + (end.getMonth() - start.getMonth());
    return {
        years: Math.floor(monthDiff / 12),
        months: monthDiff % 12
    };
}

function shouldShowPresent(period: Period, today: Date): boolean {
    return !period.end || period.start > today;
}

function isFuturePeriod(period: Period, today: Date): boolean {
    return period.start > today && period.end !== undefined;
}