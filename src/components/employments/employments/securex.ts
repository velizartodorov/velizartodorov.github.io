import { GHENT_CONTRACT } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const securex: Employment =
{
    position: "Java Developer",
    company: 'Securex',
    type: Type.Product,
    place: GHENT_CONTRACT,
    icon: '/employments/securex.png',
    period: {
        start: new Date(2023, 6),
        end: new Date(2023, 11)
    },
    description: [
        `Description 📚`,
        ``,
        `Joined Securex as an external Java software developer. 
            Worked on an internal application (Wellbeing), related to sending surveys and assessments to the employees and employers of a company, so that both can receive reports and further help for their medical status.`,
        ``,
        `Technologies 🔧`,
        ``,
        `• Language/framework: Java 11/17, Spring Boot 2.6`,
        `• API Tools: Apicurio Studio, Swagger`,
        `• Dependency management: Gradle`,
        `• Testing framework: Groovy-Spock`,
        `• CI/CD: Atlassian Bamboo`,
        `• Data monitoring: Elastic Kibana`,
        `• Deployments: Azure`,
        `• Database: Oracle, Microsoft SQL Server`,
        `• Application server: Apache Tomcat`,
        `• Architecture: Distributed microservices, Spring Cloud Gateway, Netflix Zuul API (Eureka)`,
        `• Message queues/notifications:  Amazon Simple Queue Service (SQS) / Amazon Simple Notification Service (SNS)`,
        `• Persistence: Spring Data JPA, Hibernate`,
        `• Database management: Liquibase`,
        `• Front-end: React, React Native (mobile app)`,
        `• Version control: Git, BitBucket`,
        `• IDE: IntelliJ, VS Code, DbVisualizer Pro 11.0.5`,
        `• Development methodology: Pair/solo programming`,
        `• Production methodology: Scrum with 2-week sprints (planning, retros), SAFe (Scaled agile framework)`,
        `• Time logging: Jira`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "Securex", href: "https://www.securex.be/en" },
        { value: "BeWell application", href: "https://www.securex.be/nl/personeelsbeleid/welzijn-op-het-werk" }
    ]
};