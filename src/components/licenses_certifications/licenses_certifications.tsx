import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { AccordionGroup } from '../common/accordion';
import DividedList from '../common/divided_list';
import { SectionProps } from '../common/section_props';
import LicenseCertificationItem from './license_certification_item';
import LicenseCertificationRow from './license_certification_row';
import { useLicensesCertifications } from './licenses_certrifications.init';

const LicensesCertifications = ({ className, eventKey }: SectionProps) => {
    const { t } = useTranslation();
    const institutions = useLicensesCertifications();
    const grouped = institutions.filter((item) => item.certifications.length > 1);
    const single = institutions.filter((item) => item.certifications.length <= 1);

    return (
        <AccordionWrapper title={t('licenses_certifications:title')} eventKey={eventKey} className={className}>
            <>
                {grouped.length > 0 && (
                    <AccordionGroup className="space-y-1">
                        {grouped.map((item, index) => (
                            <LicenseCertificationItem
                                item={item}
                                index={index}
                                eventKey={String(index)}
                                key={index.valueOf()}
                            />
                        ))}
                    </AccordionGroup>
                )}
                {single.length > 0 && (
                    <DividedList>
                        {single.map((item, index) => (
                            <LicenseCertificationRow item={item} key={index.valueOf()} />
                        ))}
                    </DividedList>
                )}
            </>
        </AccordionWrapper>
    );
};

export default LicensesCertifications;
