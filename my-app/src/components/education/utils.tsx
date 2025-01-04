import { Period } from "../common/period";
import { currentDate, monthYear } from "../common/utils";

export function display(period: Period): string {
    const formattedStartDate = monthYear(period.start);
    const formattedEndDate = monthYear(period.end);

    return formattedEndDate === monthYear(currentDate())
        ? `${formattedStartDate} - Present`
        : `${formattedStartDate} - ${formattedEndDate}`;
}