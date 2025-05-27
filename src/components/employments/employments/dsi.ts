import { RUSE } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const desi: Employment =
{
    position: "Full-Stack Developer",
    type: Type.Startup,
    company: 'DSI Ltd.',
    place: RUSE,
    icon: '/employments/dsi.png',
    period: {
        start: new Date(2017, 6),
        end: new Date(2018, 4)
    },
    description: [
        `Description 📚`,
        ``,
        `• Kozelat.com/Outletpc.bg – OpenCart 2.3 (PHP 7.1/Bootstrap 3) shops – development and support`,
        `• Maintaining cron jobs for product import in the shops from external suppliers`,
        `• MiAudit – (Laravel 4.2/Bootstrap 3) – system for audit and management of cleaning companies in UK`,
        `• Git/Unix shell, FileZilla, PuTTY remote maintenance of company servers`,
        `• Project management system (Redmine) & web hosting administration (Digital Ocean)`,
        `• Development methodology: Pair programming`,
        `• Production methodology: Kanban`,
        ``,
        `Domain Expertise 🌐`,
        ``,
        `• E-Commerce Development – maintaining and customizing online stores using OpenCart and Laravel frameworks`,
        `• Back-office Systems – building and supporting custom platforms for auditing and managing cleaning services (MiAudit UK)`,
        `• Web Server & Hosting Management – performing shell-based maintenance and deployments via SSH tools (PuTTY, FileZilla)`,
        `• Version Control & Collaboration – using Git and Redmine for team coordination and issue tracking`,
        `• Agile Collaboration – working in iterative cycles following Kanban practices with peer development`,
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