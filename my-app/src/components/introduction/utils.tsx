import { yearsDiff } from "../common/utils";
import { Period } from "../education/period";
import { employments } from "../employments/employments.init";

export const introduction = "As a software developer with "
    + totalWorkExperience()
    + " years of experience in the industry, my passion lies in the Java technological stack. However, I have also gained expertise in front-end frameworks such as Angular. In addition to my daily development tasks, I prioritise following best practices, documenting project flow, extracting and translating business requirements into technical ones. Additionally, I am committed to monitoring version control systems and fostering effective team collaboration."

function totalWorkExperience(): string {
    let totalYears = 0;
    for (const employment of getEmployments()) {
        totalYears += yearsDiff(employment.start, employment.end);
    }
    return `${totalYears}`;
}

function getEmployments(): Period[] {
    return employments.map((employment) => ({
        start: employment.period.start,
        end: employment.period.end,
    }));
};
