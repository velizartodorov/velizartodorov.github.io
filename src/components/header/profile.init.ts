
import { useTranslation } from 'react-i18next';
import { Link } from "./link";
import { Profile } from "./profile";

export function useProfile(): Profile {
    const { t } = useTranslation();
    return {
        name: t('profile:name'),
        imageUrl: t('profile:imageUrl'),
        email: t('profile:email', { returnObjects: true }) as Link,
        address: t('profile:address', { returnObjects: true }) as Link,
        drivingLicense: t('profile:drivingLicense', { returnObjects: true }) as Link,
        linkedIn: t('profile:linkedIn', { returnObjects: true }) as Link,
        gitHub: t('profile:gitHub', { returnObjects: true }) as Link,
        blog: t('profile:blog', { returnObjects: true }) as Link,
        languages: t('profile:languages', { returnObjects: true }) as Link[]
    }
}