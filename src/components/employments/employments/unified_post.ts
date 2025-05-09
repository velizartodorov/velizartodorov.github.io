import { GHENT } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const unified_post: Employment =
{
    position: "Software Developer",
    company: 'Unified Post',
    type: Type.Product,
    place: GHENT,
    icon: 'portfolio/employments/unified_post.jpeg',
    period: {
        start: new Date(2019, 3),
        end: new Date(2023, 3)
    },
    description: [
        `Description 📚`,
        ``,
        `• ADMS was acquired by Unified Post. Working on the Integration Portal, 
            configuration app for connecting 3rd party apps to the Unified Post flows`,
        `• Setting-up JIRA flow + Bitbucket integration, Git Gitflow`,
        `• Working on accountancy simulation app using multi-tenancy architecture (Spring Boot)`,
        `• Documenting and schematizing the flow using C4 diagrams, updating README-s`,
        `• Creating TestRail cases`,
        ``,
        `Technologies 🔧`,
        ``,
        `• Language/framework: Java 8/11, Spring Boot 2.6.7, Project Reactor`,
        `• API tool: Swagger`,
        `• Dependency management: Maven, Gradle`,
        `• Testing framework/tools: JUnit 4/5, Mockito, TestRails (testcases), Selenium`,
        `• CI/CD: BitBucket Pipelines`,
        `• Database: PostgreSQL`,
        `• Application server: Apache Tomcat 8`,
        `• Architecture: Microservices`,
        `• Persistence: Spring Data JPA, Hibernate`,
        `• Caching: Redis`,
        `• Database management: Liquibase, Flyway`,
        `• Identity/access management: KeyCloak (0Auth 2.0)`,
        `• Front-end: Angular 12`,
        `• IDE: IntelliJ, VS Code, DBeaver`,
        `• Diagram schematization and documentation: Draw.io, C4 Structurizr, Markdown`,
        `• Production methodology: Kanban & Scrum`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "Unifiedpost", href: "https://www.unifiedpost.com/" },
        { value: "Banqup", href: "https://www.banqup.com/" }
    ]
};