import { VELIKO_TARNOVO } from "../../common/utils";
import { IEducation } from "../education.init";

export const high_school: IEducation = {
    occupation: "German & English language",
    institution: "Language High school “Prof. Dr. Assen Zlatarov”",
    place: VELIKO_TARNOVO,
    icon: 'education/assen_zlatarov_language_school.jpg',
    period: {
        start: new Date(2008, 8),
        end: new Date(2013, 4)
    },
    body: [
        `References 📌`,
        ``
    ],
    references: [
        { value: "ZfA - Deutsches Sprachdiplom (DSD)", href: "/licenses_certifications/deutsch.pdf" },
        { value: "German language profile", href: "https://ezikovavt.com/%D1%87%D1%83%D0%B6%D0%B4%D0%B8-%D0%B5%D0%B7%D0%B8%D1%86%D0%B8/deutsch/" },
        { value: "English language profile", href: "https://ezikovavt.com/%D1%87%D1%83%D0%B6%D0%B4%D0%B8-%D0%B5%D0%B7%D0%B8%D1%86%D0%B8/english/" },
    ]
}