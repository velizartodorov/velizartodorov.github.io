import { VELIKO_TARNOVO } from "../common/utils";
import { IEducation } from "./education.init";
import { bachelor } from "./education/bachelor";
import { dutch } from "./education/dutch";
import { high_school } from "./education/high_school";
import { masters } from "./education/masters";

export const educations: IEducation[] = [
    dutch,
    masters,
    bachelor,
    high_school,
];