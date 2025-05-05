import { Period } from "../common/period";
import { Reference } from "../common/reference";
import { Type } from "./type";

export interface Employment {
    position: string;
    company: string;
    type: Type;
    place: string;
    icon: string;
    period: Period;
    description: Array<string>;
    references: Array<Reference>;
}