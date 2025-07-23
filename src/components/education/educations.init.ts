
import { IEducation } from "./education.init";
import enData from "./education/education.en.json";
import nlData from "./education/education.nl.json";
import { parsePeriod } from "../common/utils";

export function getEducations(lang: 'en' | 'nl'): IEducation[] {
    const data = lang === 'nl' ? nlData : enData;
    return [
        data.dutch,
        data.masters,
        data.bachelor,
        data.high_school,
    ].map(e => ({
        ...e,
        period: parsePeriod(e.period)
    }));
}