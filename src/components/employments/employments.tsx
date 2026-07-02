import {useTranslation} from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import {AccordionGroup} from '../common/accordion';
import {SectionProps} from '../common/section_props';
import EmploymentItem from './employment_item';
import {useEmployments} from './employments.init';

const Employments = ({className, eventKey}: SectionProps) => {
    const {t} = useTranslation();
    return (
        <AccordionWrapper title={t('employments:title')} eventKey={eventKey} className={className}>
            <AccordionGroup>
                {useEmployments().map((item, index) => (
                    <EmploymentItem item={item} index={index} eventKey={String(index)} key={index.valueOf()}/>
                ))}
            </AccordionGroup>
        </AccordionWrapper>
    );
};

export default Employments;