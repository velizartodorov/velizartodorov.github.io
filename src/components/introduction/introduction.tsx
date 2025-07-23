import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import { introductionBody } from './utils';

const Introduction = ({ title, className, eventKey }: SectionProps) => (
  <AccordionWrapper title={title} eventKey={eventKey} className={className}>
    {introductionBody}
  </AccordionWrapper>
);

export default Introduction;