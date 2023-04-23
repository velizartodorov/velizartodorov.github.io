import { monthYear, periodDifference } from "./utils";

export class Period {

    constructor(private readonly start: Date, private readonly end: Date) { }

    get period(): string {
        const formattedStartDate = monthYear(this.start);
        const formattedEndDate = monthYear(this.end);
        const periodDiff = periodDifference(this.start, this.end);

        return formattedStartDate === formattedEndDate
            ? `${formattedStartDate} - Present`
            : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
    }
}