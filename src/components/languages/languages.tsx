import { ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import { Language } from './language';
import LanguageItem from './language_item';
import './languages.css';

const Languages: React.FC<SectionProps> = ({ className, eventKey }) => {
  const { t } = useTranslation('languages');
  return (
    <AccordionWrapper
      eventKey={eventKey} className={className} title={t('title')}
    >
      <ListGroup variant="flush">
        {(t('list', { returnObjects: true }) as Language[]).map((language) => (
          <LanguageItem item={language} key={language.label} />
        ))}
      </ListGroup>
    </AccordionWrapper>
  );
};

export default Languages;
