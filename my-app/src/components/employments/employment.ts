import { Period } from "../common/period";
import { Reference } from "../common/reference";

export interface Employment {
    position: string;
    company: string;
    place: string;
    icon: string;
    period: Period;
    body: Array<string>;
    references: Array<Reference>;
}