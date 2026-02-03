import { Period } from "../common/period";
import { Reference } from "../common/reference";

export interface Employment {
    position: string;
    company: string;
    type: string;
    place: string;
    icon: string;
    period: Period;
    description: Array<string>;
    references: Array<Reference>;
}