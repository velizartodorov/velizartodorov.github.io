
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import EmploymentItem from './employment_item';
import './employments.css';
import { employments } from './employments.init';
import enData from './employments.en.json';
import nlData from './employments.nl.json';
import { useContext } from 'react';
import { LanguageContext } from '../common/language_selector';

const Employments = ({ className, eventKey }: SectionProps) => {
  const { language } = useContext(LanguageContext);
  const data = language === 'nl' ? nlData : enData;
  return (
    <AccordionWrapper title={data.title} eventKey={eventKey} className={className}>
      {employments.map((item, index) => (
        <EmploymentItem item={item} index={index} eventKey={String(index)} key={index} />
      ))}
    </AccordionWrapper>
  );
};

export default Employments;