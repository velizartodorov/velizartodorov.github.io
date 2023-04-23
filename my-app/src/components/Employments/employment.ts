import { Period } from "./period";

export interface IEmployment {
    position: string;
    company: string;
    place: string;
    icon: string;
    period: Period;
    body: string;
}

export default IEmployment;