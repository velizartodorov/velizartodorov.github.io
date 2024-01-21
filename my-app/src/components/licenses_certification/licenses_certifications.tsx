import { Accordion, Card } from 'react-bootstrap';

const LicensesCertifications = () => (
  <Accordion defaultActiveKey="1">
    <Accordion.Item eventKey="1">
      <Card>
        <Accordion.Header><h2>Licenses & certifications 🔖</h2></Accordion.Header>
        <Accordion.Body>
        <Card><h4>Employments</h4></Card>
        </Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default LicensesCertifications;