
import { ListGroup } from 'react-bootstrap';
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import LicenseCertificationItem from './license_certification_item';
import './licenses_certifications.css';
import { licensesCertifications } from './licenses_certrifications.init';
import enLang from './licenses_certifications.en.lang.json';
import nlLang from './licenses_certifications.nl.lang.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/language_selector';


const LicensesCertifications = ({ className, eventKey }: SectionProps) => {
  const { language } = useContext(LanguageContext);
  const lang = language === 'nl' ? nlLang : enLang;
  return (
    <AccordionWrapper title={lang.title} eventKey={eventKey} className={className}>
      <ListGroup variant="flush">
        {licensesCertifications.map((item, index) => (
          <LicenseCertificationItem item={item} index={index} key={index} />
        ))}
      </ListGroup>
    </AccordionWrapper>
  );
};

export default LicensesCertifications;