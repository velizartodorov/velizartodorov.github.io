import { GENT, ROUSSE, VELIKO_TARNOVO } from "../places";
import { IEducation } from "./education.init";

export const educations: IEducation[] = [
    {
        occupation: "Dutch/Flemmish Language & Literature",
        institution: 'Het Perspectief PCVO',
        place: GENT,
        icon: '/education/cvo_gent.png',
        period: {
            start: new Date(2020, 6),
            end: new Date(2019, 0)
        },
        body: [
            `References 📌`,
        ],
        references: [
            { value: "Dutch second language - level 2 (B2)", href: "https://www.vlaanderen.be/opleidingsdatabank/nederlands-tweede-taal-richtgraad-2" },
        ]
    },
    {
        occupation: "Software Engineering (Master's degree)",
        institution: 'University of Rousse',
        place: ROUSSE,
        icon: '/education/university_ruse.png',
        period: {
            start: new Date(2017, 8),
            end: new Date(2018, 6)
        },
        body: [
            `References 📌`,
        ],
        references: [
            { value: "University of Ruse", href: "https://www.uni-ruse.bg/en" },
        ]
    },
    {
        occupation: "Computer Engineering (Bachelor's degree)",
        institution: 'University of Rousse',
        place: ROUSSE,
        icon: '/education/university_ruse.png',
        period: {
            start: new Date(2013, 8),
            end: new Date(2017, 6)
        },
        body: [
            `References 📌`,
        ],
        references: [
            { value: "University of Ruse", href: "https://www.uni-ruse.bg/en" },
        ]
    },
    {
        occupation: "German & English language",
        institution: "Language High school “Prof. Dr. Assen Zlatarov”",
        place: VELIKO_TARNOVO,
        icon: '/education/assen_zlatarov_language_school.jpg',
        period: {
            start: new Date(2008, 8),
            end: new Date(2013, 4)
        },
        body: [
            `References 📌`,
        ],
        references: [
            { value: "English language profile", href: "https://ezikovavt.com/%D1%87%D1%83%D0%B6%D0%B4%D0%B8-%D0%B5%D0%B7%D0%B8%D1%86%D0%B8/english/" },
            { value: "German language profile", href: "https://ezikovavt.com/%D1%87%D1%83%D0%B6%D0%B4%D0%B8-%D0%B5%D0%B7%D0%B8%D1%86%D0%B8/german/" },
        ]
    },
];