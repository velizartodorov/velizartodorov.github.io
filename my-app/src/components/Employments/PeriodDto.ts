import { formatDate, periodDifference } from "./Utils";

export class Period {

    constructor(private readonly start: Date, private readonly end: Date) { }

    get period(): string {
        const formattedStartDate = formatDate(this.start);
        const formattedEndDate = formatDate(this.end);
        const periodDiff = periodDifference(this.start, this.end);

        return formattedStartDate === formattedEndDate
            ? `${formattedStartDate} - Present`
            : `${formattedStartDate} - ${formattedEndDate} ${periodDiff}`;
    }
}