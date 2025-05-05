import { Period } from "../common/period";
import { Reference } from "../common/reference";

export interface IEducation {
    occupation: string;
    institution: string;
    place: string;
    icon: string;
    period: Period;
    body: Array<string>;
    references: Array<Reference>;
}