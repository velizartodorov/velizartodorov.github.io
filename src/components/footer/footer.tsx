import { useTranslation } from 'react-i18next';
import { useProfile } from '../header/profile.init';
import { tw } from '../common/utils';
import { useCurrentYear } from './utils';

const COMMIT_SHA = import.meta.env.VITE_COMMIT_SHA as string | undefined;
const REPO_URL = 'https://github.com/velizartodorov/velizartodorov.github.io';

const Footer = () => {
    const { year } = useCurrentYear();
    const { t } = useTranslation();
    const profile = useProfile();
    return (
        <div className="mt-2 mb-2 text-center max-sm:text-[0.9rem]">
            {t('common:poweredBy')} {profile.name} Â® {year ?? ''} ðŸ˜‰ ðŸš€
            {COMMIT_SHA && (
                <a
                    className={tw(
                        'text-app-text-muted hover:text-app-text-muted ml-2 font-mono text-xs no-underline',
                        'opacity-60 hover:opacity-100',
                    )}
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
