import { Period } from "../common/period";
import { currentDate, monthYear } from "../common/utils";

import { useContext } from "react";
import { LanguageContext } from '../common/language_selector';

export function useDisplayPeriod() {
    const { language } = useContext(LanguageContext);

    function yearMonthDiff(period: Period): string {
        const monthDiff = (period.end.getFullYear() - period.start.getFullYear()) * 12
            + (period.end.getMonth() - period.start.getMonth());
        const yearDiff = Math.floor(monthDiff / 12);
        const remainingMonths = monthDiff % 12;
        let yearString = '';
        let monthString = '';
        if (language === 'nl') {
            yearString = yearDiff > 0 ? `${yearDiff} jaar` : '';
            monthString = remainingMonths > 0 ? `${remainingMonths} maand${remainingMonths > 1 ? 'en' : ''}` : '';
        } else {
            yearString = yearDiff > 0 ? `${yearDiff} years` : '';
            monthString = remainingMonths > 0 ? `${remainingMonths} months` : '';
        }
        const separator = yearString && monthString ? ', ' : '';
        return `(${yearString}${separator}${monthString})`;
    }

    function periodDifference(period: Period): string {
        const diff = yearMonthDiff(period);
        return diff ? `${diff}` : '';
    }

    function display(period: Period): string {
        const formattedStartDate = monthYear(period.start, language);
        const formattedEndDate = monthYear(period.end, language);
        const periodDiff = periodDifference(period);
        const presentText = language === 'nl' ? 'heden' : 'Present';
        return formattedEndDate === monthYear(currentDate(), language)
            ? `${formattedStartDate} - ${presentText} ${yearMonthDiff(period)}`
            : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
    }

    return { display, periodDifference, yearMonthDiff };
}