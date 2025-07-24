
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import './education.css';
import EducationItem from './education_item';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { parsePeriod } from './utils';

const Education = ({ className, eventKey }: Omit<SectionProps, 'title'>) => {
  const { t } = useTranslation();
  const title = t('education:title') || '';
  const list = t('education:list', { returnObjects: true }) as any[];
  const educations = Array.isArray(list)
    ? list.map((e: any) => ({
        ...e,
        period: e.period ? parsePeriod(e.period) : { start: new Date(0), end: new Date(0) },
      }))
    : [];
  return (
    <AccordionWrapper title={title} eventKey={eventKey} className={className}>
      {educations.map((item, index) => (
        <EducationItem item={item} index={index} key={index} />
      ))}
    </AccordionWrapper>
  );
};

export default Education;