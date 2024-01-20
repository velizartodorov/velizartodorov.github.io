import { Accordion, Card } from 'react-bootstrap';
import { introduction } from "./utils";

const Introduction = () => (
  <Accordion defaultActiveKey="0">
    <Accordion.Item eventKey="0">
      <Card>
        <Accordion.Header><h2>Introduction 👋</h2></Accordion.Header>
        <Accordion.Body>{introduction}</Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default Introduction;