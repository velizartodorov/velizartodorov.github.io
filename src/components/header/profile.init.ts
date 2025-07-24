
import { Profile } from "./profile";
import { useTranslation } from 'react-i18next';

export function useProfile(): Profile {
    const { t } = useTranslation();
    const profile = t('profile', { returnObjects: true }) as any;
     console.log('Header profile', JSON.stringify(t('profile:name'), null, 2));
    return {
        name: profile?.name ?? '',
        imageUrl: profile?.imageUrl ?? '',
        email: profile?.email ?? { label: '', icon: '', width: 24, url: '' },
        address: profile?.address ?? { label: '', icon: '', width: 24, url: '' },
        drivingLicense: profile?.drivingLicense ?? { label: '', icon: '', width: 24, url: '' },
        linkedIn: profile?.linkedIn ?? { label: '', icon: '', width: 24, url: '' },
        gitHub: profile?.gitHub ?? { label: '', icon: '', width: 24, url: '' },
        blog: profile?.blog ?? { label: '', icon: '', width: 24, url: '' },
        languages: Array.isArray(profile?.languages)
            ? profile.languages.map((l: any) => ({
                label: typeof l?.label === 'string' ? l.label : '',
                icon: typeof l?.icon === 'string' ? l.icon : '',
                width: typeof l?.width === 'number' ? l.width : 24,
                url: typeof l?.url === 'string' ? l.url : '',
            }))
            : [],
    };
}