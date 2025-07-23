


import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import EmploymentItem from './employment_item';
import './employments.css';
import { employments } from './employments.init';

const Employments = ({ title, className, eventKey }: SectionProps) => (
  <AccordionWrapper title={title} eventKey={eventKey} className={className}>
    {employments.map((item, index) => (
      <EmploymentItem item={item} index={index} eventKey={String(index)} key={index} />
    ))}
  </AccordionWrapper>
);

export default Employments;