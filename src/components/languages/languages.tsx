import { useTranslation } from 'react-i18next';
import Section from '../common/section';
import { Timeline } from '../common/timeline';
import { SectionProps } from '../common/section_props';
import { Language } from './language';
import LanguageItem from './language_item';
import React from 'react';

const Languages: React.FC<SectionProps> = ({ className, id }) => {
    const { t, ready } = useTranslation('languages');
    const languagesList = t('list', { returnObjects: true });
    const languages = Array.isArray(languagesList) ? languagesList : [];

    return (
        <Section className={className} title={t('title')} id={id}>
            <Timeline>
                {ready &&
                    languages.map((language: Language, index: number) => (
                        <LanguageItem item={language} index={index} key={language.label} />
                    ))}
            </Timeline>
        </Section>
    );
};

export default Languages;
