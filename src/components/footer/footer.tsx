import { useContext } from 'react';
import { LanguageContext } from '../common/language_selector';
import getProfile from './../header/profile.init';
import './footer.css';
import { useCurrentYear } from './utils';
import enPeriod from '../common/lang.period.en.json';
import nlPeriod from '../common/lang.period.nl.json';

const Footer = () => {
  const { year } = useCurrentYear();
  const { language } = useContext(LanguageContext);
  const profile = getProfile(language);
  const periodLang = language === 'nl' ? nlPeriod : enPeriod;
  return (
    <div className="text-center mt-2 mb-2 footer-font">
      {periodLang.period.poweredBy} {profile.name} ® {year ?? ''} 😉 🚀
    </div>
  );
};

export default Footer;