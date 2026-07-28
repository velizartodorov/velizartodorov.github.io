import { useTranslation } from 'react-i18next';
import Section from '../common/section';
import { Timeline } from '../common/timeline';
import { SectionProps } from '../common/section_props';
import EmploymentItem from './employment_item';
import { useEmployments } from './employments.init';

const Employments = ({ className, id }: SectionProps) => {
    const { t } = useTranslation();
    return (
        <Section title={t('employments:title')} className={className} id={id}>
            <Timeline>
                {useEmployments().map((item, index) => (
                    <EmploymentItem item={item} index={index} key={index.valueOf()} />
                ))}
            </Timeline>
        </Section>
    );
};

export default Employments;
