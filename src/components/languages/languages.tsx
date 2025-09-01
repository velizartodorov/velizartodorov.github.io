import React from 'react';
import { useProfile } from '../header/profile.init';
import ProfileItem from '../header/profile_item';
import { Link } from '../header/link';
import AccordionWrapper from '../common/accordion_wrapper';
import Table from 'react-bootstrap/Table';
import './languages.css';

interface LanguagesProps {
  className?: string;
  eventKey?: string;
}

const Languages: React.FC<LanguagesProps> = ({ className, eventKey }) => {
  const profile = useProfile();
  
  return (
    <AccordionWrapper
      eventKey={eventKey}
      className={className}
      title="Languages 🌐"
    >
      <Table responsive hover className="m-0 languages-table">
        <thead>
          <tr>
            <th>Language</th>
            <th>Level</th>
            <th>Proficiency</th>
          </tr>
        </thead>
        <tbody>
          {profile.languages.map((language: Link) => (
            <tr key={language.label}>
              <td>
                <ProfileItem link={language} />
              </td>
              <td>{language.level}</td>
              <td>{language.proficiency}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AccordionWrapper>
  );
};

export default Languages;
