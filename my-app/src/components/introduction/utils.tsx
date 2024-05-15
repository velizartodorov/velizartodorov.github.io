import { Period } from "../common/period";
import { employments } from "../employments/employments.init";

export const introduction = `As a software developer with ${totalYears()} years of experience in the industry, my passion lies in the Java technological stack. However, I have also gained expertise in front-end frameworks such as Angular. In addition to my daily development tasks, I prioritize following best practices, documenting project flow, extracting and translating business requirements into technical ones. Additionally, I am committed to monitoring version control systems and fostering effective team collaboration.`;

function totalYears(): number {
    return getEmployments().reduce((totalYears, period) => {
        return totalYears + yearsDifference(period);
    }, 0);
}

function getEmployments(): Period[] {
    return employments.map((employment) => ({
        start: employment.period.start,
        end: employment.period.end,
    }));
}

export function yearsDifference(period: Period): number {
    return period.end.getFullYear() - period.start.getFullYear();
}