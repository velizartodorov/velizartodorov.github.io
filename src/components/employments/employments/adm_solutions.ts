import { GHENT } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const adm_solutions: Employment =
{
    position: "Java Developer",
    company: 'ADM Solutions',
    type: Type.Product,
    place: GHENT,
    icon: '/employments/adm_solutions.jpg',
    period: {
        start: new Date(2018, 10),
        end: new Date(2019, 2)
    },
    description: [
        `Description 📚`,
        ``,
        `• Integrating, developing and improving automatized invoice/dossier flows with external services such as BillToBox (BanqUp), ELO and accountancy packages`,
        `• Documenting and schematizing the flow using UML diagrams`,
        `• Working on InvoiceFlow, monolitic application which distributes invoices towards different accountancy packages like Expert-M, Adsolut, ExactOnline, BoCount, Wings Online and also persists them in a document management system called ELO`,
        `• Working on DossierFlow, monolitic application which reads information about user dossiers from Adsolut and imports them in ELO`,
        `• Migrating Java applications from SVN to Git`,
        ``,
        `Technologies 🔧`,
        ``,
        `• Language: Java 8`,
        `• Testing framework: JUnit 4`,
        `• Database: Microsoft SQL Server 2008-2012`,
        `• Application server: Apache Tomcat 8`,
        `• OS: Windows Server 2008-2012`,
        `• External API: ELO API`,
        `• Persistence: Java Database Connectivity (JDBC)`,
        `• Architecture: Java Servlet`,
        `• Front-end: Java Server Pages (JSP) + jQuerry/Ajax`,
        `• Version Control: SVN/Git, BitBucket`,
        `• IDE: Eclipse`,
        `• Diagram schematization: Draw.io, MS Visio`,
        `• Development methodology: Pair programming`,
        `• Production methodology: Kanban`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "ADM Solutions", href: "https://web.archive.org/web/20181111090144/https://adm-solutions.eu/nl/" },
        { value: "ELO", href: "https://www.elo.com/en-de.html" }
    ]
}