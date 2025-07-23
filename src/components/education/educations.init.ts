
import { IEducation } from "./education.init";
import enData from "./education/education.en.json";
import nlData from "./education/education.nl.json";
import { parsePeriod } from "./utils";

export function getEducations(lang: 'en' | 'nl'): IEducation[] {
    const data = lang === 'nl' ? nlData : enData;
    return data.data.map((e: any) => ({
        ...e,
        period: parsePeriod(e.period)
    }));
}