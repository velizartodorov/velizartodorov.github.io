import { GHENT } from "../../common/utils";
import { Employment } from "../employment";
import { Type } from "../type";

export const docbyte: Employment =
{
    position: "Full-Stack Developer",
    company: 'Docbyte',
    type: Type.Service,
    place: GHENT,
    icon: 'portfolio/employments/docbyte.jpg',
    period: {
        start: new Date(2024, 3),
        end: new Date(2025, 2)
    },
    description: [
        `
            Docbyte is a leading organization that provides intelligent technologies
            to various knowledge worker organizations, from banks and insurers to any enterprise
            in the field of information security, preservation, and document processing.
            Their platform helps to automate document processes and preserve digital information,
            enabling the clients to prepare for a fully digital future.`,
        ``,
        `Description 📚`,
        ``,
        `• Accident management - solving incident/bug tickets and acting as a mediator between engineering and service desk`,
        `• Migrating legacy on-premise apps towards cloud serverless AWS Lambda solution`,
        `• Integrating Amazon Textract as an OCR solution for the cloud infrastructure`,
        `• Documenting the flow in C4 architectural diagram`,
        `• Following ISO 27001/9001/QTSP standards in the ecosystem of Docbyte`,
        `• Leading the daily meetings, when team lead was not available`,
        ``,
        `Technologies - Cloud Solution 🔧`,
        ``,
        `• Language: Java 17, Python 3`,
        `• Framework: Quarkus`,
        `• Services: AWS Lambda/AWS Step Functions/SNS/SQS`,
        `• API Tools: AWS API Gateway`,
        `• Dependency management: Maven`,
        `• Testing framework: Quarkus Test Framework JUnit 4`,
        `• Storage:  Amazon Simple Storage Service (S3)`,
        `• Event bus: Amazon EventBridge`,
        `• Artifacts repository: AWS CodeArtifact`,
        `• Deployments: AWS CodePipeline`,
        `• Building: AWS CodeBuild`,
        `• Database: AWS DynamoDB, Amazon Relational Database (RDS), PostgreSQL`,
        `• Database management: AWS Management Console`,
        `• Application server: AWS SAM (Serverless Application Model)`,
        `• Architecture: Serverless, microservices`,
        `• Identity/access management: KeyCloak, AWS Identity and Access Management (IAM)`,
        `• OCR: Google AI, Amazon Textract, Native OCR`,
        `• Front-end: Angular 12`,
        `• IDE: IntelliJ, VS Code, PyCharm`,
        `• Diagram schematization and documentation: draw.io`,
        `• Development methodology: Pair/solo programming`,
        `• Task management: JIRA`,
        `• Time logging: JIRA Tempo`,
        `• Production methodology: Scrum, sprints of two weeks`,
        ``,
        `Technologies - Legacy on-premise solution 🔧`,
        ``,
        `• Language/framework: .NET 4.5 / OpenText Captiva`,
        `• OCR: Google AI`,
        `• Database: Microsoft SQL Server, PostgreSQL`,
        `• Ecosystem: Microsoft services / batch processing`,
        `• Version control: Git / BitBucket`,
        ``,
        `References 📌`,
        ``,
    ],
    references: [
        { value: "Amazon Textract", href: "https://aws.amazon.com/textract/" },
        { value: "Aspose.PDF | Java PDF Document Processing Class Library", href: "https://releases.aspose.com/pdf/java/" },
        { value: "Docbyte N.V.", href: "https://www.docbyte.com/" },
    ]
};