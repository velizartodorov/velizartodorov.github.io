import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import { monthYear } from '../common/utils';
import './licenses_certifications.css';
import { licensesCertifications } from './licenses_certrifications.init';
import { v4 as uuidv4 } from 'uuid';

const LicensesCertifications = () => (
  <Accordion defaultActiveKey="1" className="mt-4 mx-4">
    <Accordion.Item eventKey="1">
      <Card>
        <Accordion.Header>
          <h4 className="px-2">Licenses & certifications 🔖</h4>
        </Accordion.Header>
        <Accordion.Body>
          {licensesCertifications.map((license) => {
            const hasLink = license.link && license.link.trim() !== '';
            const Wrapper = hasLink ? 'a' : 'div';
            return (
              <Card key={uuidv4()}>
                <Container fluid>
                  <Row
                    as={Wrapper}
                    href={hasLink ? license.link : undefined}
                    target={hasLink ? "_blank" : undefined}
                    rel={hasLink ? "noopener noreferrer" : undefined}
                    className="align-items-center accordion-button collapsed p-2"
                    id="accordion-button"
                  >
                    <Col xs="auto" className="text-left">
                      <img
                        src={process.env.PUBLIC_URL + license.icon}
                        height="25"
                        alt="education icon"
                        className="w-30"
                      />
                    </Col>
                    <Col xs={9} md={5} className="text-left license-col">
                      <h5 className='license-font'>{license.name}</h5>
                    </Col>
                    <Col className="d-none d-sm-block">{license.institution}</Col>
                    <Col xs="auto" className="text-right d-none d-sm-block">
                      <h5>{monthYear(license.date)}</h5>
                    </Col>
                  </Row>
                </Container>
              </Card>
            );
          })}
        </Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default LicensesCertifications;