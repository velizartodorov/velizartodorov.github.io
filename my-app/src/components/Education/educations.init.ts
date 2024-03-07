import { GHENT, RUSE, UNVERSITY_RUSE, VELIKO_TARNOVO } from "../common/utils";
import { IEducation } from "./education.init";

export const educations: IEducation[] = [
    {
        occupation: "Dutch/Flemmish Language & Literature",
        institution: 'Het Perspectief PCVO',
        place: GHENT,
        icon: '/education/cvo_gent.png',
        period: {
            start: new Date(2019, 0),
            end: new Date(2020, 6)
        },
        body: [
            `References 📌`,
        ],
        references: [
            { value: "Educational certificate - Dutch second language - Level 2 (B2)", href: "/certificates/nederlands.pdf" },
            { value: "Dutch second language - Level 2 (B2) information", href: "https://www.vlaanderen.be/opleidingsdatabank/nederlands-tweede-taal-richtgraad-2" }
        ]
    },
    {
        occupation: "Software Engineering (Master's degree)",
        institution: UNVERSITY_RUSE,
        place: RUSE,
        icon: '/education/university_ruse.png',
        period: {
            start: new Date(2017, 8),
            end: new Date(2018, 6)
        },
        body: [
            `References 📌`,
        ],
        references: [
            { value: UNVERSITY_RUSE, href: "https://www.uni-ruse.bg/en" },
        ]
    },
    {
        occupation: "Computer Engineering (Bachelor's degree)",
        institution: UNVERSITY_RUSE,
        place: RUSE,
        icon: '/education/university_ruse.png',
        period: {
            start: new Date(2013, 8),
            end: new Date(2017, 6)
        },
        body: [
            `References 📌`,
        ],
        references: [
            { value: UNVERSITY_RUSE, href: "https://www.uni-ruse.bg/en" },
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
            { value: "ZfA - Deutsches Sprachdiplom (DSD)", href: "/certificates/deutsch.pdf" },
            { value: "German language profile", href: "https://ezikovavt.com/%D1%87%D1%83%D0%B6%D0%B4%D0%B8-%D0%B5%D0%B7%D0%B8%D1%86%D0%B8/deutsch/" },
            { value: "English language profile", href: "https://ezikovavt.com/%D1%87%D1%83%D0%B6%D0%B4%D0%B8-%D0%B5%D0%B7%D0%B8%D1%86%D0%B8/english/" },
        ]
    },
];