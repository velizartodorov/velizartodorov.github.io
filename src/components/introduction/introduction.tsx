
import AccordionWrapper from '../common/accordion_wrapper';
import enData from './lang.en.json';
import nlData from './lang.nl.json';
import { interpolate } from './utils';
import { Properties } from '../common/properties';
import { totalYears, totalTime } from './utils';
import { useContext } from 'react';
import { LanguageContext } from '../common/language_selector';

const Introduction = ({ className, eventKey }: Properties) => {
  const { language } = useContext(LanguageContext);
  const data = language === 'nl' ? nlData : enData;
  const body = interpolate(data.body, { totalYears: totalYears(), totalTime: totalTime() });
  return (
    <AccordionWrapper title={data.title} eventKey={eventKey} className={className}>
      {body}
    </AccordionWrapper>
  );
};

export default Introduction;
