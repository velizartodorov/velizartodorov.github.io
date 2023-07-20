import { GENT } from "../constants";
import { IEmployment } from "./employment";

export const employments: IEmployment[] = [
    {
        position: "Java Software Crafter",
        company: 'Continuum',
        place: "Hybrid (" + GENT + ")",
        icon: '/employments/continuum.jpg',
        period: {
            start: new Date(2023, 5),
            end: new Date(2023, 5)
        },
        body: [
            'Joined the Continuum tribe, consulting clients using Java based applications',
            'References 📌',
            'https://www.continuum.be/en/'
        ]
    },
    {
        position: "Software Developer",
        company: 'Unified Post',
        place: GENT,
        icon: '/employments/unified_post.png',
        period: {
            start: new Date(2019, 4),
            end: new Date(2023, 4)
        },
        body: [
            'Joined the Continuum tribe, consulting clients using Java based applications',
            'References 📌',
            '\https://www.continuum.be/en/'
        ]
    },
    {
        position: "Java Developer",
        company: 'ADM Solutions',
        place: GENT,
        icon: '/employments/adm_solutions.jpg',
        period: {
            start: new Date(2018, 11),
            end: new Date(2019, 3)
        },
        body: [
            'Joined the Continuum tribe, consulting clients using Java based applications',
            'References 📌',
            '\https://www.continuum.be/en/'
        ]
    },
    {
        position: "Erasmus+ C# Developer Trainee",
        company: 'ADM Solutions',
        place: GENT,
        icon: '/employments/adm_solutions.jpg',
        period: {
            start: new Date(2018, 7),
            end: new Date(2018, 10)
        },
        body: [
            `Technologies 🔧`,

            `• Overview of C# programming concepts and approaches in .NET 4.0 and higher (Visual Studio 2015/17)`,
            `• Design and implementation of C#-based software`,
            `• Improving workflow and providing support functions`,
            `• Performing tests over C#-based software components`,
            `• Development methodology: Pair programming`,
            `• Production methodology: Kanban`,

            `References 📌`,

            ` • https://erasmus-plus.ec.europa.eu/`,
            ` • https://www.uni-ruse.bg/en`
        ]
    },
    {
        position: "Full-Stack Developer",
        company: 'DSI Ltd.',
        place: 'Rousse, Bulgaria',
        icon: '/employments/dsi.png',
        period: {
            start: new Date(2017, 7),
            end: new Date(2018, 5)
        },
        body: [
            `Technologies 🔧`,

            `• Kozelat.com/Outletpc.bg – OpenCart 2.3 (PHP 7.1/Bootstrap 3) shops – development and support`,
            `• MiAudit – (Laravel 4.2/Bootstrap 3) – system for audit and management of cleaning companies in UK`,
            `• Git/Unix shell, FileZilla, PuTTY remote maintenance of company servers`,
            `• Project management system (Redmine) & web hosting administration (Digital Ocean)`,
            `• Development methodology: Pair programming`,
            `• Production methodology: Kanban`,

            `References 📌`,

            `• https://kozelat.com/`,
            `• https://outletpc.bg/`,
            `• https://miaudit.com/`
        ]
    }
];