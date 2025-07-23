import { Accordion, Card, ListGroup } from 'react-bootstrap';
import './licenses_certifications.css';
import { licensesCertifications } from './licenses_certrifications.init';
import LicenseItem from './license_item';

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
            {licensesCertifications.map((license, id) => (
              <LicenseItem license={license} key={id} />
            ))}
          </ListGroup>
        </Card>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
);

export default LicensesCertifications;