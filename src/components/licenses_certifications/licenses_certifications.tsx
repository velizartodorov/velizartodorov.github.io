import { Accordion, Card, ListGroup, Row, Col } from 'react-bootstrap';
import { monthYear } from '../common/utils';
import './licenses_certifications.css';
import { licensesCertifications } from './licenses_certrifications.init';
import { v4 as uuidv4 } from 'uuid';

const LicensesCertifications = () => (
  <Accordion defaultActiveKey="1" className="mt-4 mx-4">
    <Accordion.Item eventKey="1">
      <Accordion.Header>
        <h4 className="px-2 license-heading">Licenses & certifications 🔖</h4>
      </Accordion.Header>
      <Accordion.Body>
        <Card>
          <ListGroup variant="flush">
            {licensesCertifications.map((license) => {
              const hasLink = license.link?.trim();
              const Wrapper = hasLink ? 'a' : 'div';
              return (
                <ListGroup.Item
                  as={Wrapper}
                  key={uuidv4()}
                  href={hasLink || undefined}
                  rel={hasLink ? 'noopener noreferrer' : undefined}
                  className="p-2"
                >
                  <Row className="align-items-center md-ps-2">
                    <Col xs={12} md={5}
                      className="d-flex align-items-center mb-2 mb-md-0 md-ps-4">
                      <img
                        src={process.env.PUBLIC_URL + license.icon}
                        height="25"
                        alt="license icon"
                        className="me-3 flex-shrink-0"
                      />
                      <h5 className="license-font mb-0 md-ps-2">
                        {license.name}
                      </h5>
                    </Col>
                    <Col xs={12} md={4}
                      className="text-left mb-2 ps-5 mb-md-0 d-none d-sm-block">
                      {license.institution}
                    </Col>
                    <Col xs={12} md={3}
                      className="text-end d-none d-sm-block pe-5">
                      <h5 >{monthYear(license.date)}</h5>
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

export default LicensesCertifications;