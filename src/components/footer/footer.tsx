import { useTranslation } from 'react-i18next';
import { useProfile } from '../header/profile.init';
import './footer.css';
import { useCurrentYear } from './utils';

const Footer = () => {
  const { year } = useCurrentYear();
  const { t } = useTranslation();
  const profile = useProfile();
  return (
    <div className="text-center mt-2 mb-2 footer-font">
      {t('common:poweredBy')} {profile.name} ® {year ?? ''} 😉 🚀
    </div>
  );
};

export default Footer;