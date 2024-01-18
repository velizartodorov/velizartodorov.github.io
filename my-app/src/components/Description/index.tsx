import { Card } from "react-bootstrap";
import { currentDate } from "../Employments/utils";
import { yearsDiff } from "./utils";

const Introduction = () => (
  <>
    <Card>
      <Card.Header><h2>Introduction</h2></Card.Header>
      <Card.Body>
        <Card.Text>
          As a software developer with {yearsDiff(new Date(2017, 6), currentDate())} years of experience in the industry, my passion lies in the Java technological stack. However, I have also gained expertise in front-end frameworks such as Angular. In addition to my daily development tasks, I prioritise following best practices, documenting project flow, extracting and translating business requirements into technical ones. Additionally, I am committed to monitoring version control systems and fostering effective team collaboration.
        </Card.Text>
      </Card.Body>
    </Card>
  </>
);

export default Introduction;