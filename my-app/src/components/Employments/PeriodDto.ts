import { formatDate, periodDifference } from "./Utils";

export class Period {

    constructor(private readonly start: Date, private readonly end: Date) { }

    get period(): string {
        return `${this.formattedStartDate} - ${this.formattedEndDate} ${this.periodDifference}`;
    }

    private get formattedStartDate(): string {
        return formatDate(this.start);
    }

    private get formattedEndDate(): string {
        return formatDate(this.end);
    }

    private get periodDifference(): string {
        return periodDifference(this.start, this.end);
    }
}