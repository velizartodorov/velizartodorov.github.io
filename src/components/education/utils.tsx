import { Period } from "../common/period";
import { currentDate, monthYear } from "../common/utils";

export function display(period: Period, lang: 'en' | 'nl'): string {
    const formattedStartDate = monthYear(period.start, lang);
    const formattedEndDate = monthYear(period.end, lang);

    return formattedEndDate === monthYear(currentDate(), lang)
        ? `${formattedStartDate} - ${lang === 'nl' ? 'heden' : 'Present'}`
        : `${formattedStartDate} - ${formattedEndDate}`;
}