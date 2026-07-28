import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ItemHeaderRow from '../common/item_header_row';
import Markdown from '../common/markdown';
import { TimelineEntry } from '../common/timeline';
import { IEducation } from './education.init';
import { useDisplayPeriod } from './utils';

const EducationItem: FC<{ item: IEducation; index: number }> = ({ item, index }) => {
    const { t } = useTranslation();
    const atWord = t('common:period.at');
    const { display } = useDisplayPeriod();

    return (
        <TimelineEntry
            id={String(index)}
            icon={{ src: item.icon, alt: `${item.institution} logo` }}
            header={
                <ItemHeaderRow
                    title={`${item.occupation} ${atWord} ${item.institution}`}
                    titleClassName="w-9/12 text-left md:w-7/12"
                    place={item.place}
                    period={display(item.period)}
                />
            }
        >
            {item.body && (
                <div className="mt-3">
                    <Markdown>{item.body}</Markdown>
                </div>
            )}
        </TimelineEntry>
    );
};
export default EducationItem;
