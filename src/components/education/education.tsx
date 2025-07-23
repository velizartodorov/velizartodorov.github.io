import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import { getEducations } from './educations.init';
import './education.css';
import EducationItem from './education_item';


import React, { useContext } from 'react';
import { LanguageContext } from '../common/language_selector';

const Education = ({ title, className, eventKey }: SectionProps) => {
  const { language } = useContext(LanguageContext);
  const educations = getEducations(language);
  return (
    <AccordionWrapper title={title} eventKey={eventKey} className={className}>
      {educations.map((item, index) => (
        <EducationItem item={item} index={index} key={index} />
      ))}
    </AccordionWrapper>
  );
};

export default Education;