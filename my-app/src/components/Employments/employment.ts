import { Period } from "./period";
import { Reference } from "./reference";

export interface IEmployment {
    position: string;
    company: string;
    place: string;
    icon: string;
    period: Period;
    body: Array<string>;
    references: Array<Reference>;
}