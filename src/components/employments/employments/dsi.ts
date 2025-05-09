import { RUSE } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const desi: Employment =
{
    position: "Full-Stack Developer",
    type: Type.Startup,
    company: 'DSI Ltd.',
    place: RUSE,
    icon: 'portfolio/employments/dsi.png',
    period: {
        start: new Date(2017, 6),
        end: new Date(2018, 4)
    },
    description: [
        `Description 📚`,
        ``,
        `• Kozelat.com/Outletpc.bg – OpenCart 2.3 (PHP 7.1/Bootstrap 3) shops – development and support`,
        `• MiAudit – (Laravel 4.2/Bootstrap 3) – system for audit and management of cleaning companies in UK`,
        `• Git/Unix shell, FileZilla, PuTTY remote maintenance of company servers`,
        `• Project management system (Redmine) & web hosting administration (Digital Ocean)`,
        `• Development methodology: Pair programming`,
        `• Production methodology: Kanban`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "DSI Ltd - Developing Software Innovations", href: "https://dsi.bg/en/" },
        { value: "Kozelat.com", href: "https://kozelat.com/" },
        { value: "Outletpc.bg", href: "https://outletpc.bg/" },
        { value: "MiAudit", href: "https://miaudit.com/" }
    ]
}