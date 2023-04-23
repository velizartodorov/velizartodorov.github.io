import { getMonth } from "./Utils";

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

    getStartDateString(): String {
        return getMonth(this.startDate
            .getMonth())
            + " "
            + this.startDate
                .getFullYear()
                .toString();
    }

    getEndDateString(): String {
        return getMonth(this.endDate
            .getMonth())
            + " "
            + this.endDate
                .getFullYear()
                .toString();
    }
}