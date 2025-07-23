import { Period } from "../common/period";
import { currentDate } from "../common/utils";
import enCommon from '../common/common.en.json';
import nlCommon from '../common/common.nl.json';

export function display(period: Period, lang: 'en' | 'nl'): string {
    const formattedStartDate = monthYear(period.start, lang);
    const formattedEndDate = monthYear(period.end, lang);

    return formattedEndDate === monthYear(currentDate(), lang)
        ? `${formattedStartDate} - ${lang === 'nl' ? 'heden' : 'Present'}`
        : `${formattedStartDate} - ${formattedEndDate}`;
}

export function monthYear(date: Date, lang: 'en' | 'nl' = 'en'): string {
    const months = lang === 'nl' ? nlCommon.months : enCommon.months;
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${months[month]} ${year}`;
}