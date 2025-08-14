import { ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import './presentations.css';
import { usePresentations } from './presentations.init';
import PresentationItem from './presentation_item';

const Presentations = ({ className, eventKey }: SectionProps) => {
  const { t } = useTranslation();
  const presentations = usePresentations();
  return (
    <AccordionWrapper title={t('presentations:title')}
      eventKey={eventKey} className={className}>
      <ListGroup variant="flush">
        {presentations.map((item, index) => (
          <PresentationItem item={item} index={index} key={index} />
        ))}
      </ListGroup>
    </AccordionWrapper>
  );
};

export default Presentations;