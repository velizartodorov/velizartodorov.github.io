import { Accordion, Card, ListGroup } from 'react-bootstrap';
import './licenses_certifications.css';
import { licensesCertifications } from './licenses_certrifications.init';
import LicenseCertificationItem from './license_certification_item';

const LicensesCertifications = () => (
  <Accordion defaultActiveKey="1" className="mt-3 mx-4">
    <Accordion.Item eventKey="1">
      <Accordion.Header>
        <h4 className="px-2 mb-1 license-heading">
          Licenses & certifications 🔖
        </h4>
      </Accordion.Header>
      <Accordion.Body>
        <Card>
          <ListGroup variant="flush">
                  {licensesCertifications.map((item, index) => (
                    <LicenseCertificationItem item={item} index={index} key={index} />
                  ))}
          </ListGroup>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

export default LicensesCertifications;