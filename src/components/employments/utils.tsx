
import { useTranslation } from 'react-i18next';
import { Period } from "../common/period";
import { currentDate } from "../common/utils";

export function useDisplayPeriod() {
    const { t } = useTranslation(['common']);

    function monthYear(date: Date): string {
        const months = t('common:months', { returnObjects: true }) as string[];
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${months[month]} ${year}`;
    }

    function yearMonthDiff(period: Period): string {
        const periodLang = t('common:period', { returnObjects: true }) as Record<string, string>;
        const monthDiff = (period.end.getFullYear() - period.start.getFullYear()) * 12
            + (period.end.getMonth() - period.start.getMonth());
        const yearDiff = Math.floor(monthDiff / 12);
        const remainingMonths = monthDiff % 12;
        let yearString = '';
        let monthString = '';
        if (yearDiff > 0) {
            yearString = `${yearDiff} ${yearDiff === 1 ? periodLang.year : periodLang.years}`;
        }
        if (remainingMonths > 0) {
            monthString = `${remainingMonths} ${remainingMonths === 1 ? periodLang.month : periodLang.months}`;
        }
        const separator = yearString && monthString ? ', ' : '';
        return `(${yearString}${separator}${monthString})`;
    }

    function periodDifference(period: Period): string {
        const diff = yearMonthDiff(period);
        return diff ? `${diff}` : '';
    }

    function display(period: Period): string {
        const periodLang = t('common:period', { returnObjects: true }) as Record<string, string>;
        const formattedStartDate = monthYear(period.start);
        const formattedEndDate = monthYear(period.end);
        const periodDiff = periodDifference(period);
        const presentText = periodLang.present;
        return formattedEndDate === monthYear(currentDate())
            ? `${formattedStartDate} - ${presentText} ${yearMonthDiff(period)}`
            : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
    }

    return { display, periodDifference, yearMonthDiff };
}
