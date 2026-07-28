import { useTranslation } from 'react-i18next';
import Section from '../common/section';
import { Timeline } from '../common/timeline';
import { SectionProps } from '../common/section_props';
import { usePresentations } from './presentations.init';
import PresentationItem from './presentation_item';

const Presentations = ({ className, id }: SectionProps) => {
    const { t } = useTranslation();
    const presentations = usePresentations();
    return (
        <Section title={t('presentations:title')} className={className} id={id}>
            <Timeline>
                {presentations.map((item, index) => (
                    <PresentationItem item={item} index={index} key={index.valueOf()} />
                ))}
            </Timeline>
        </Section>
    );
};

export default Presentations;
