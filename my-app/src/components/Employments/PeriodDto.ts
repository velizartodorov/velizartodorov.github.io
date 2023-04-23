import { getMonth, yearMonthDiff } from "./Utils";

export class Period {
    private startDate: Date = new Date();
    private endDate: Date = new Date();

    constructor(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getPeriod() {
        return this.getPeriodString()
            + " "
            + this.getPeriodDifference();
    }

    private getPeriodDifference() {
        return yearMonthDiff(this.getStartDate(), this.getEndDate());
    }

    private getPeriodString() {
        return this.getStartDateString()
            + " - "
            + this.getEndDateString()
    }

    private getStartDateString(): String {
        return getMonth(this.startDate
            .getMonth())
            + " "
            + this.startDate
                .getFullYear()
                .toString();
    }

    private getEndDateString(): String {
        return getMonth(this.endDate
            .getMonth())
            + " "
            + this.endDate
                .getFullYear()
                .toString();
    }
}