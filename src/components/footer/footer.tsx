import { useContext } from 'react';
import { LanguageContext } from '../common/language_selector';
import getProfile from './../header/profile.init';
import './footer.css';
import { useCurrentYear } from './utils';

const Footer = () => {
  const { year } = useCurrentYear();
  const { language } = useContext(LanguageContext);
  const profile = getProfile(language);
  return (
    <div className="text-center mt-2 mb-2 footer-font">
      Powered by {profile.name} ® {year ?? ''} 😉 🚀
    </div>
  );
};

export default Footer;