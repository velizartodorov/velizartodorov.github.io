import { Period } from "./period";

export interface IEmployment {
    position: string;
    company: string;
    place: string;
    icon: string;
    period: Period;
    body: Array<string>;
    references: Array<Reference>;
}

export interface Reference {
    id: number;
    value: string;
    href: string;
}