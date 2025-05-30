import { Accordion, Card, ListGroup, Row, Col } from 'react-bootstrap';
import { monthYear } from '../common/utils';
import './licenses_certifications.css';
import { licensesCertifications } from './licenses_certrifications.init';
import { v4 as uuidv4 } from 'uuid';

const LicensesCertifications = () => (
  <Accordion defaultActiveKey="1" className="mt-3 mx-4">
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
                  className="p-10 list-group-item"
                >
                  <Row className="align-items-center">
                    <Col xs="auto" className="text-left license-icon">
                      <img src={process.env.PUBLIC_URL + license.icon}
                        height="25"
                        alt="license icon"
                        width="30" />
                    </Col>
                    <Col xs={9} md={5} className="text-left">
                      <h5 className="license-font mb-0">
                        {license.name}
                      </h5>
                    </Col>
                    <Col
                      className="text-left d-none d-sm-block ps-0">
                      {license.institution}
                    </Col>
                    <Col xs="auto"
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