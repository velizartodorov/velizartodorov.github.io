import { useTranslation } from 'react-i18next';
import Section from '../common/section';
import { Timeline } from '../common/timeline';
import { SectionProps } from '../common/section_props';
import { parsePeriod } from '../common/utils';
import EducationItem from './education_item';
import { IEducation } from './education.init';

const Education = ({ className, id }: Omit<SectionProps, 'title'>) => {
    const { t } = useTranslation();
    const title = t('education:title');
    const list = t('education:list', { returnObjects: true }) as IEducation[];
    const educations = Array.isArray(list)
        ? list.map((e: any) => ({
              ...e,
              period: e.period ? parsePeriod(e.period, t) : { start: new Date(0), end: new Date(0) },
          }))
        : [];
    return (
        <Section title={title} className={className} id={id}>
            <Timeline>
                {educations.map((item, index) => (
                    <EducationItem item={item} index={index} key={index.valueOf()} />
                ))}
            </Timeline>
        </Section>
    );
};

export default Education;
