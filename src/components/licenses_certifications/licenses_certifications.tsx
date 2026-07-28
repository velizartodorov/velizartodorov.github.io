import { useTranslation } from 'react-i18next';
import Section from '../common/section';
import { Timeline } from '../common/timeline';
import { SectionProps } from '../common/section_props';
import LicenseCertificationItem from './license_certification_item';
import { useLicensesCertifications } from './licenses_certifications.init';

const LicensesCertifications = ({ className, id }: SectionProps) => {
    const { t } = useTranslation();
    const institutions = useLicensesCertifications();

    return (
        <Section title={t('licenses_certifications:title')} className={className} id={id}>
            <Timeline>
                {institutions.map((item, index) => (
                    <LicenseCertificationItem item={item} index={index} key={index.valueOf()} />
                ))}
            </Timeline>
        </Section>
    );
};

export default LicensesCertifications;
