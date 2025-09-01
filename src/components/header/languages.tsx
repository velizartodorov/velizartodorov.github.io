import React from 'react';
import { useProfile } from './profile.init';
import ProfileItem from './profile_item';
import { Link } from './link';

const Languages: React.FC = () => {
  const profile = useProfile();
  return (
    <div className="profile-languages mb-2">
      <strong>Languages:</strong>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {profile.languages.map((language: Link) => (
          <ProfileItem link={language} key={language.label} />
        ))}
      </div>
    </div>
  );
};

export default Languages;
