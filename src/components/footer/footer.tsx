import { useTranslation } from 'react-i18next';
import getProfile from './../header/profile.init';
import './footer.css';
import { useCurrentYear } from './utils';

const Footer = () => {
  const { year } = useCurrentYear();
  const { i18n, t } = useTranslation();
  const language = i18n.language as 'en' | 'nl';
  const profile = getProfile(language);
  return (
    <div className="text-center mt-2 mb-2 footer-font">
      {t('common:poweredBy')} {profile.name} ® {year ?? ''} 😉 🚀
    </div>
  );
};

export default Footer;