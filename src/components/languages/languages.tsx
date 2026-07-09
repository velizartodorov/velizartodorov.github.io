import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import DividedList from '../common/divided_list';
import { SectionProps } from '../common/section_props';
import { Language } from './language';
import LanguageItem from './language_item';
import React from 'react';

const Languages: React.FC<SectionProps> = ({ className, eventKey }) => {
    const { t, ready } = useTranslation('languages');

    // Get languages list with type safety
    const languagesList = t('list', { returnObjects: true });
    const languages = Array.isArray(languagesList) ? languagesList : [];

    return (
        <AccordionWrapper eventKey={eventKey} className={className} title={t('title')}>
            <DividedList>
                {ready && languages.map((language: Language) => <LanguageItem item={language} key={language.label} />)}
            </DividedList>
        </AccordionWrapper>
    );
};

export default Languages;
