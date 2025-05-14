import { GHENT } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const erasmus_bikema: Employment =
{
    position: "Erasmus+ C# Developer Trainee",
    company: 'BIKEMA',
    type: Type.ResearchAndDevelopment,
    place: GHENT,
    icon: '/employments/bikema_small.png',
    period: {
        start: new Date(2018, 6),
        end: new Date(2018, 9)
    },
    description: [
        `Description 📚`,
        ``,
        `• Overview of C# programming concepts and approaches in .NET 4.0 and higher (Visual Studio 2015/17)`,
        `• Design and implementation of C#-based software`,
        `• Improving workflow and providing support functions`,
        `• Performing tests over C#-based software components`,
        `• Development methodology: Pair programming`,
        `• Production methodology: Kanban`,
        ``,
        `Domain Expertise 🌐`,
        ``,
        `• Academic R&D Collaboration – participating in international research projects through Erasmus+ and academic partnerships`,
        `• Software Design & Implementation – hands-on experience designing and coding C# applications using .NET Framework 4.0+`,
        `• Code Testing & Validation – validating custom components through functional and modular testing strategies`,
        `• Workflow Optimization – supporting team productivity by improving internal tooling and development pipelines`,
        `• Technical Communication – contributing to collaborative projects across multiple stakeholders in university and private sector`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "Erasmus+", href: "https://erasmus-plus.ec.europa.eu/" },
        { value: "University of Ruse", href: "https://www.uni-ruse.bg/en" },
        { value: "BIKEMA information", href: "http://fetch.ecs.uni-ruse.bg/?cmd=gsProfile&user=FERNAND" },
        { value: "Lotuswebtec.com", href: "https://www.lotuswebtec.com/en/" }
    ]
}