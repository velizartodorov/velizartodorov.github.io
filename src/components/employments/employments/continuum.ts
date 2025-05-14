import { HASSELT_REMOTE } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const continuum: Employment =
{
    position: "Java Software Crafter",
    company: 'Continuum Consulting NV',
    type: Type.Consultancy,
    place: HASSELT_REMOTE,
    icon: '/employments/continuum.jpg',
    period: {
        start: new Date(2023, 4),
        end: new Date(2024, 0)
    },
    description: [
        `Description 📚`,
        ``,
        `Joined the Continuum tribe, consulting clients using Java based applications.`,
        ``,
        `• Research & development on internal applications, such as E-Tribe Tool and HR Interview Tool`,
        `• Experimenting with Docker, Kubernetes and tryouts for migrating from Elastic BeanStalk to Kubernetes`,
        `• Updating documentation`,
        ``,
        `Technologies 🔧`,
        ``,
        `• Language/framework: Java 17, Spring Boot 2.6.7`,
        `• API Tools: Swagger`,
        `• Dependency management: Gradle`,
        `• Containerization: Docker`,
        `• DevOps: Elastic BeanStalk`,
        `• Testing framework: JUnit 4`,
        `• Deployments: Confluence Bamboo, Azure`,
        `• Database: PostgreSQL, Amazon DynamoDB (serverless, key-value NoSQL database)`,
        `• Application server: Apache Tomcat 8`,
        `• Architecture: Microservices, Client-server`,
        `• Persistence: Spring Data JPA/R2DBC, Hibernate`,
        `• Database management: Flyway`,
        `• Identity/access management: KeyCloak (0Auth 2.0)`,
        `• Front-end: Angular 12`,
        `• Version control: Git, GitHub`,
        `• IDE: IntelliJ, VS Code`,
        `• Diagram schematization and documentation: Mermaid.js`,
        `• Development methodology: Pair/solo programming`,
        `• Time logging: Teamleader`,
        `• Production methodology: Kanban`,
         ``,
        `Domain Expertise 🌐`,
        ``,
        `• Internal Tooling & Automation – R&D on productivity platforms such as interview and HR tools`,
        `• Enterprise Application Development – working on modular Java/Spring Boot microservices in a consultancy setting`,
        `• DevOps Enablement – experimenting with Docker and Kubernetes as part of infrastructure modernization`,
        `• Cloud Migration Strategy – evaluating migration paths from Elastic Beanstalk to Kubernetes-based infrastructure`,
        `• Agile Delivery – operating in Kanban-driven team for continuous improvement and task-based flow`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "Continuum Consulting NV", href: "https://www.continuum.be/en/" }
    ]
};