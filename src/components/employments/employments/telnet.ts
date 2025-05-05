import { ELENA } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const telnet: Employment =
{
    position: "Computer Repair Technician",
    type: Type.Service,
    company: 'Telnet Ltd.',
    place: ELENA,
    icon: '/employments/telnet.png',
    period: {
        start: new Date(2015, 6),
        end: new Date(2015, 8)
    },
    description: [
        `Description 📚`,
        ``,
        `• software and hardware fixing PC-s, laptops, mobile phones, tables`,
        `• changing, cleaning and maintaining hardware components of computer configurations`,
        `• software reinstallation, backup and maintance`,
        `• creating hardware parts list for PC configuration based on customer requirements`,
        ``,
        `The company has already been acquired by the largest telecom in Bulgaria – Vivacom (2024). 💡`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "Telnet", href: "https://telnet.bg/en/pc/home/p1/.html" },
        { value: "Vivacom", href: "https://www.vivacom.bg/bg/telnet" },
    ]
};