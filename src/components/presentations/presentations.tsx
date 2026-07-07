import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import DividedList from '../common/divided_list';
import { SectionProps } from '../common/section_props';
import { usePresentations } from './presentations.init';
import PresentationItem from './presentation_item';

const Presentations = ({ className, eventKey }: SectionProps) => {
    const { t } = useTranslation();
    const presentations = usePresentations();
    return (
        <AccordionWrapper title={t('presentations:title')} eventKey={eventKey} className={className}>
            <DividedList>
                {presentations.map((item, index) => (
                    <PresentationItem item={item} index={index} key={index.valueOf()} />
                ))}
            </DividedList>
        </AccordionWrapper>
    );
};

export default Presentations;
