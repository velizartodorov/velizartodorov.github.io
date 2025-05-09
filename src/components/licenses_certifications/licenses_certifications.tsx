import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import { licensesCertifications } from './licenses_certrifications.init';
import './licenses_certifications.css';
import { monthYear } from '../common/utils';

const LicensesCertifications = () => (
  <Accordion defaultActiveKey="1" className="mt-3 mx-3">
    <Accordion.Item eventKey="1">
      <Card>
        <Accordion.Header>
          <h4 className="px-2">Licenses & certifications 🔖</h4>
        </Accordion.Header>
        <Accordion.Body>
          {licensesCertifications.map((license) => (
            <Card key={license.link}>
              <Container fluid>
                <Row className="align-items-center accordion-button collapsed p-2"
                  target="_blank"
                  id='accordion-button'
                  rel="noopener noreferrer">
                  <Col xs="auto" className="text-left">
                    <a
                      target="_blank"
                      rel="noopener noreferrer">
                      <img src={license.icon}
                        alt="education icon"
                        className='w-30' />
                    </a>
                  </Col>
                  <Col xs="5" className="text-left">
                    <a
                      target="_blank"
                      rel="noopener noreferrer">
                      <h5>{`${license.name}`}</h5>
                    </a>
                  </Col>
                  <Col> {license.institution}</Col>
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