import { ROUSSE } from "../places";
import { IEducation as IEducation } from "./employment";

export const employments: IEducation[] = [
    {
        occupation: "Software Engineering (Master's degree)",
        institution: 'University of Rousse',
        place: ROUSSE,
        icon: '/education/university_ruse.png',
        period: {
            start: new Date(2017, 8),
            end: new Date(2018, 8)
        },
        body: [
            `Description 📚`,
            ``,
            `Technologies 🔧`,
            ``,
            `References 📌`,
            ``,
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
            end: new Date(2017, 8)
        },
        body: [
            `Description 📚`,
            ``,
            `Technologies 🔧`,
            ``,
            `References 📌`,
            ``,
        ],
        references: [
            { value: "University of Ruse", href: "https://www.uni-ruse.bg/en" },
        ]
    },
];