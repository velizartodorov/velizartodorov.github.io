import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import { educations } from './educations.init';
import './education.css';
import EducationItem from './education_item';

const Education = ({ title, className, eventKey }: SectionProps) => (
  <AccordionWrapper title={title} eventKey={eventKey} className={className}>
    {educations.map((item, index) => (
      <EducationItem item={item} index={index} key={index} />
    ))}
  </AccordionWrapper>
);

export default Education;