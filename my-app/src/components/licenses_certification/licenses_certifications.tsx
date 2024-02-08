import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import { licenses } from './licenses.init';
import './style.css';
import { monthYear } from './utils';

const LicensesCertifications = () => (
  <Accordion defaultActiveKey="1" className="mt-3 mx-3">
    <Accordion.Item eventKey="1">
      <Card>
        <Accordion.Header><h4>Licenses & certifications 🔖</h4></Accordion.Header>
        <Accordion.Body>
          {licenses.map((license) => (
            <Card key={license.link}>
              <Container fluid>
                <Row className="align-items-center accordion-button collapsed"
                  href={license.link}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Col xs="auto" className="text-left">
                    <a href={license.link} target="_blank" rel="noopener noreferrer">
                      <img src={license.icon} alt="education icon" style={{ width: 30 }} />
                    </a>
                  </Col>
                  <Col xs="5" className="text-left">
                    <a href={license.link} target="_blank" rel="noopener noreferrer">
                      <h5>{`${license.name}`}</h5>
                    </a>
                  </Col>
                  <Col>
                    {license.institution}
                  </Col>
                  <Col xs="auto" className="text-right">
                    <h5>{`${monthYear(license.date)}`}</h5>
                  </Col>
                </Row>
              </Container>
            </Card>
          ))}
        </Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default LicensesCertifications;