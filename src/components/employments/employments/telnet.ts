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
        `Domain Expertise 🌐`,
        ``,
        `• IT Support & Repair – hands-on experience repairing consumer and office hardware including PCs, laptops, phones, and tablets`,
        `• Hardware Maintenance – performing upgrades, diagnostics, and component-level servicing on computing devices`,
        `• Software Installation & Troubleshooting – reinstalling OS, managing backups, and resolving system-level software issues`,
        `• Custom PC Configuration – selecting hardware components and building systems tailored to customer needs`,
        `• Customer Service – direct communication with clients to identify technical needs and deliver appropriate solutions`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "Vivacom", href: "https://www.vivacom.bg/bg/telnet" }
    ]
};