import { Period } from "./period";
import { Reference } from "./reference";

export interface IEducation {
    occupation: string;
    institution: string;
    place: string;
    icon: string;
    period: Period;
    body: Array<string>;
    references: Array<Reference>;
}