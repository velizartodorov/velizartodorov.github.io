import { Accordion, Card } from "react-bootstrap";
import { educations } from "./educations.init";
import './education.css';
import EducationItem from "./education_item";

const Education = () => (
  <Accordion defaultActiveKey="1" className="mt-3 mx-4">
    <Accordion.Item eventKey="1">
      <Card>
        <Accordion.Header>
          <h4 className="px-2 mb-1">Education 🦉</h4>
        </Accordion.Header>
        <Accordion.Body>
          <Accordion>
            {educations.map((education, index) => (
              <EducationItem key={index} education={education} index={index} />
            ))}
          </Accordion>
        </Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default Education;