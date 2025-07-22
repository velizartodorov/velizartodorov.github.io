import { Accordion, Card } from "react-bootstrap";
import { employments } from "./employments.init";
import './employments.css';
import EmploymentItem from "./employment_item";

const Employments = () => (
  <Accordion defaultActiveKey="0" className="mt-3 mx-4">
    <Accordion.Item eventKey="0">
      <Card>
        <Accordion.Header>
          <h4 className="px-2 mb-1">Employments 💼</h4>
        </Accordion.Header>
        <Accordion.Body>
          <Accordion>
            {employments.map((employment, idx) => (
              <EmploymentItem employment={employment} eventKey={String(idx)} key={employment.company + employment.position} />
            ))}
          </Accordion>
        </Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default Employments;