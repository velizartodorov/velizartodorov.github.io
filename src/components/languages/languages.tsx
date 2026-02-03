import { ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import { Language } from './language';
import LanguageItem from './language_item';
import './languages.css';
import React from "react";

const Languages: React.FC<SectionProps> = ({ className, eventKey }) => {
  const { t, ready } = useTranslation('languages');
  
  // Get languages list with type safety
  const languagesList = t('list', { returnObjects: true });
  const languages = Array.isArray(languagesList) ? languagesList : [];
  
  return (
    <AccordionWrapper
      eventKey={eventKey} className={className} title={t('title')}
    >
      <ListGroup variant="flush">
        {ready && languages.map((language: Language) => (
          <LanguageItem item={language} key={language.label} />
        ))}
      </ListGroup>
    </AccordionWrapper>
  );
};

export default Languages;
