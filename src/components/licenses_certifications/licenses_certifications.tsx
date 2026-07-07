import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import DividedList from '../common/divided_list';
import { SectionProps } from '../common/section_props';
import LicenseCertificationItem from './license_certification_item';
import { useLicensesCertifications } from './licenses_certrifications.init';

const LicensesCertifications = ({ className, eventKey }: SectionProps) => {
    const { t } = useTranslation();
    const licensesCertifications = useLicensesCertifications();
    return (
        <AccordionWrapper title={t('licenses_certifications:title')} eventKey={eventKey} className={className}>
            <DividedList>
                {licensesCertifications.map((item, index) => (
                    <LicenseCertificationItem item={item} index={index} key={index.valueOf()} />
                ))}
            </DividedList>
        </AccordionWrapper>
    );
};

export default LicensesCertifications;
