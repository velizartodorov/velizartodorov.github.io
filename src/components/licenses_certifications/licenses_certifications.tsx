
import { ListGroup } from 'react-bootstrap';
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import LicenseCertificationItem from './license_certification_item';
import './licenses_certifications.css';
import { licensesCertifications } from './licenses_certrifications.init';

const LicensesCertifications = ({ title, className, eventKey }: SectionProps) => (
  <AccordionWrapper title={title} eventKey={eventKey} className={className}>
    <ListGroup variant="flush">
      {licensesCertifications.map((item, index) => (
        <LicenseCertificationItem item={item} index={index} key={index} />
      ))}
    </ListGroup>
  </AccordionWrapper>
);

export default LicensesCertifications;