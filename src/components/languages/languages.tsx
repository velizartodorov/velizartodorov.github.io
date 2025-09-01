import React from 'react';
import Table from 'react-bootstrap/Table';
import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { Link } from '../header/link';
import ProfileItem from '../header/profile_item';
import './languages.css';

interface LanguagesProps {
  className?: string;
  eventKey?: string;
}

const Languages: React.FC<LanguagesProps> = ({ className, eventKey }) => {
  const { t } = useTranslation('languages');

  return (
    <AccordionWrapper
      eventKey={eventKey}
      className={className}
      title={t('title')}
    >
      <Table responsive hover className="m-0 languages-table">
        <tbody>
          {(t('list', { returnObjects: true }) as Link[]).map((language: Link) => (
            <tr key={language.label}>
              <td>
                <ProfileItem link={language} />
              </td>
              <td>{language.proficiency}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AccordionWrapper>
  );
};

export default Languages;
