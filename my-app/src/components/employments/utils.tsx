import { Period } from "../common/period";
import { currentDate, monthYear, periodDifference } from "../common/utils";

export function display(period: Period): string {
    const formattedStartDate = monthYear(period.start);
    const formattedEndDate = monthYear(period.end);
    const periodDiff = periodDifference(period);

    return formattedEndDate === monthYear(currentDate())
        ? `${formattedStartDate} - Present ${!periodDiff ? periodDiff : ''}`
        : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
}