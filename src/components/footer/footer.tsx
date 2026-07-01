import { useTranslation } from 'react-i18next';
import { useProfile } from '../header/profile.init';
import './footer.css';
import { useCurrentYear } from './utils';

const COMMIT_SHA = import.meta.env.VITE_COMMIT_SHA as string | undefined;
const REPO_URL = 'https://github.com/velizartodorov/velizartodorov.github.io';

const Footer = () => {
  const { year } = useCurrentYear();
  const { t } = useTranslation();
  const profile = useProfile();
  return (
    <div className="text-center mt-2 mb-2 footer-font">
      {t('common:poweredBy')} {profile.name} ® {year ?? ''} 😉 🚀
      {COMMIT_SHA && (
        <a
          className="footer-commit"
          href={`${REPO_URL}/commit/${COMMIT_SHA}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {COMMIT_SHA.slice(0, 7)}
        </a>
      )}
    </div>
  );
};

export default Footer;