import { useContext } from 'react';
import { LanguageContext } from '../common/language_selector';
import getProfile from './../header/profile.init';
import './footer.css';
import { useCurrentYear } from './utils';
import enCommon from '../common/common.en.json';
import nlCommon from '../common/common.nl.json';

const Footer = () => {
  const { year } = useCurrentYear();
  const { language } = useContext(LanguageContext);
  const profile = getProfile(language);
  const commonLang = language === 'nl' ? nlCommon : enCommon;
  return (
    <div className="text-center mt-2 mb-2 footer-font">
      {commonLang.poweredBy} {profile.name} ® {year ?? ''} 😉 🚀
    </div>
  );
};

export default Footer;